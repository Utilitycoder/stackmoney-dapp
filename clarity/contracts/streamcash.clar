;; Stream Cash Contract
;; Stream cash to a recipient for a fixed period of time.

;; Constants
(define-constant err-unauthorized (err u0))
(define-constant err-invalid-signature (err u1))
(define-constant err-stream-still-active (err u2))
(define-constant err-invalid-stream-id (err u3))

;; Data vars
(define-data-var latest-stream-id uint u0)

;; Maps
(define-map streams
  uint ;; stream-id
  {
    sender: principal,
    recipient: principal,
    balance: uint,
    withdrawn-balance: uint,
    payment-per-block: uint,
    timeframe: (tuple (start-block uint) (stop-block uint))
  }
)

;; Create a new stream
;; Transfers initial balance from caller to contract
;; Returns the stream ID
(define-public (stream-to
    (recipient principal)
    (initial-balance uint)
    (timeframe (tuple (start-block uint) (stop-block uint)))
    (payment-per-block uint)
  )
  (begin
    (try! (stx-transfer? initial-balance contract-caller (as-contract tx-sender)))
    (let (
      (current-stream-id (var-get latest-stream-id))
      (stream {
        sender: contract-caller,
        recipient: recipient,
        balance: initial-balance,
        withdrawn-balance: u0,
        payment-per-block: payment-per-block,
        timeframe: timeframe
      })
    )
      (map-set streams current-stream-id stream)
      (var-set latest-stream-id (+ current-stream-id u1))
      (ok current-stream-id)
    )
  )
)

;; Increase the locked STX balance for a stream
;; Only the sender can add more funds to their stream
(define-public (refuel
    (stream-id uint)
    (amount uint)
  )
  (let (
    (stream (unwrap! (map-get? streams stream-id) err-invalid-stream-id))
  )
    (asserts! (is-eq contract-caller (get sender stream)) err-unauthorized)
    (try! (stx-transfer? amount contract-caller (as-contract tx-sender)))
    (map-set streams stream-id 
      (merge stream {balance: (+ (get balance stream) amount)})
    )
    (ok amount)
  )
)

;; Withdraw received tokens
;; Only the recipient can withdraw their available balance
(define-public (withdraw
    (stream-id uint)
  )
  (let (
    (stream (unwrap! (map-get? streams stream-id) err-invalid-stream-id))
    (balance (balance-of stream-id contract-caller))
  )
    (asserts! (is-eq contract-caller (get recipient stream)) err-unauthorized)
    (map-set streams stream-id 
      (merge stream {withdrawn-balance: (+ (get withdrawn-balance stream) balance)})
    )
    (try! (as-contract (stx-transfer? balance tx-sender (get recipient stream))))
    (ok balance)
  )
)

;; Withdraw excess locked tokens
;; Only the sender can refund excess balance after the stream has ended
(define-public (refund
    (stream-id uint)
  )
  (let (
    (stream (unwrap! (map-get? streams stream-id) err-invalid-stream-id))
    (balance (balance-of stream-id (get sender stream)))
  )
    (asserts! (is-eq contract-caller (get sender stream)) err-unauthorized)
    (asserts! (< (get stop-block (get timeframe stream)) burn-block-height) err-stream-still-active)
    (map-set streams stream-id (merge stream {
        balance: (- (get balance stream) balance),
      }
    ))
    (try! (as-contract (stx-transfer? balance tx-sender (get sender stream))))
    (ok balance)
  )
)

;; Update stream configuration
;; Requires signature from either sender or recipient
;; Can update payment-per-block and timeframe
(define-public (update-details
    (stream-id uint)
    (payment-per-block uint)
    (timeframe (tuple (start-block uint) (stop-block uint)))
    (signer principal)
    (signature (buff 65))
  )
  (let (
    (stream (unwrap! (map-get? streams stream-id) err-invalid-stream-id))  
  )
    (asserts! (validate-signature (hash-stream stream-id payment-per-block timeframe) signature signer) err-invalid-signature)
    (asserts!
      (or
        (and (is-eq (get sender stream) contract-caller) (is-eq (get recipient stream) signer))
        (and (is-eq (get sender stream) signer) (is-eq (get recipient stream) contract-caller))
      )
      err-unauthorized
    )
    (map-set streams stream-id (merge stream {
        payment-per-block: payment-per-block,
        timeframe: timeframe
    }))
    (ok true)
  )
)

;; Getter functions
;; Calculate the number of blocks a stream has been active
(define-read-only (calculate-block-delta
    (timeframe (tuple (start-block uint) (stop-block uint)))
  )
  (let (
    (start-block (get start-block timeframe))
    (stop-block (get stop-block timeframe))

    (delta 
      (if (<= burn-block-height start-block)
        ;; then
        u0
        ;; else
        (if (< burn-block-height stop-block)
          ;; then
          (- burn-block-height start-block)
          ;; else
          (- stop-block start-block)
        ) 
      )
    )
  )
    delta
  )
)

;; Check balance for a party involved in a stream
(define-read-only (balance-of
    (stream-id uint)
    (who principal)
  )
  (let (
    (stream (unwrap! (map-get? streams stream-id) u0))
    (block-delta (calculate-block-delta (get timeframe stream)))
    (recipient-balance (* block-delta (get payment-per-block stream)))
  )
    (if (is-eq who (get recipient stream))
      (- recipient-balance (get withdrawn-balance stream))
      (if (is-eq who (get sender stream))
        (- (get balance stream) recipient-balance)
        u0
      )
    )
  )
)

;; Get hash of stream for signature verification
(define-read-only (hash-stream
    (stream-id uint)
    (new-payment-per-block uint)
    (new-timeframe (tuple (start-block uint) (stop-block uint)))
  )
  (let (
    (stream (unwrap! (map-get? streams stream-id) (sha256 0)))
    (msg (concat (concat (unwrap-panic (to-consensus-buff? stream)) (unwrap-panic (to-consensus-buff? new-payment-per-block))) (unwrap-panic (to-consensus-buff? new-timeframe))))
  )
    (sha256 msg)
  )
)

;; Signature verification
(define-read-only (validate-signature (hash (buff 32)) (signature (buff 65)) (signer principal))
  (is-eq 
    (principal-of? (unwrap! (secp256k1-recover? hash signature) false)) 
    (ok signer)
  )
)

;;; recursive.scm — Minimal Recursive Symbolic Machine (Guile Scheme)
;;; ---------------------------------------------------------------
;;; Core idea: Apply a symbolic program (a list of symbols)
;;; to a symbolic frame (a nested cons structure),
;;; using pure recursion and only cons-based primitives.

;;; ——————————— Primitives ———————————

(define (link x y)
  (cons x y))                 ; structural connection (cons cell)


(define (focus frame)         ; symbolic focus (left branch)
  (if (pair? frame)
      (car frame)
      '()))

(define (next frame)
  (cdr frame))                ; symbolic motion (right branch)

(define (atom-frame x)
  (link x '()))               ; wrap an atom into a safe pair structure

;;; ——————————— Data ———————————

;; A symbolic frame of atomic elements
(define frame
  (link (atom-frame 'A)
        (link (atom-frame 'B)
              (link (atom-frame 'C)
                    (atom-frame 'D)))))

;; A symbolic program: focus → next → focus
(define program
  (link 'focus
        (link 'next
              (link 'focus '()))))

;; An agent is just a pair: (ID . program)
(define agent
  (link 'agent-id program))

;;; ——————————— Process Engine ———————————

;; Pure recursive symbolic execution
;; Each program step is a symbol: 'focus or 'next
;; The step function applies each symbol to the current cursor (frame)
(define (step cursor program)
  (if (null? program)
      cursor                           ; halt when program is exhausted
      (step
        (cond
          ((eq? (focus program) 'focus) (focus cursor))
          ((eq? (focus program) 'next)  (next cursor))
          (else cursor))               ; default: do nothing
        (next program))))

;;; ——————————— Runner ———————————

;; Run the agent’s program over the target frame
;; (skip the agent's ID by calling (next agent))
(display (step frame (next agent)))
(newline)


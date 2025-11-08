; Identity: lone wrapper exposes the argument
(def I (() ()))
; K keeps the focus (car) and collapses the context (cdr)
(def K (I ()))
; S re-enters the context twice via K layers
(def S (K ()))

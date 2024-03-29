var qbBidIds = `7 6 REDOUBLE
7 5 DOUBLE
7 7 PASS
R 1 alert
R 2 natural
R 4 artificial
E 2 and
E 1 not
E 3 or
F 11 is_a
L 1 true
L 0 false
A 10 Range
A 11 Hand
A 12 Specif
A 13 Def
A 14 Conventions
A 15 depending_Conventions
A 16 not_applicable_Conventions
A 9 Bid
A 7 Predicate
A 8 Function
A 17 Set
A 5 States
A 3 Memory-Variable
A 4 Work-Variable
A 6 Symbols
A 19 Declarations
A 20 End-Declarations
A 18 Protocol
A 21 Repeat
A 22 Until
A 31 include
H 1 NONE
H 2 ONE
H 3 TWO
H 4 ALL
K 1 unit
K 2 opponent
K 3 return
B 1 if
B 2 then
B 3 else
B 4 fi
B 5 FORALL
B 6 of
5 20 prob
5 8 hcp
5 9 tp-nt
5 41 nr-aces
5 32 suit-longest
5 33 suit-second-longest
5 34 suit-second-shortest
5 35 suit-shortest
5 36 mlen-suit-longest
5 37 mlen-suit-second-longest
5 38 mlen-suit-second-shortest
5 39 mlen-suit-shortest
5 40 tp-suit-longest
5 48 major-longer
5 49 major-shorter
5 50 minor-longer
5 51 minor-shorter
N 1 lho
N 0 self
N 2 partner
N 3 rho
Q 1 follow-bid-to-rho
Q 2 answer
Q 3 follow-bid-to-lho
Q 4 my-previous-bid
Q 5 no_priority
Q 6 with_priority
Q 7 rough
Q 8 full
Q 9 can_compare
Q 10 cannot_compare
Q 11 should_compare
Q 12 must_compare
Q 13 weak_compare
Q 14 limit_compare
Q 16 compare
Q 17 must_original
P 1 Rubber
P 2 Chicago
P 3 Match
P 4 IMP
O 2 they
O 1 we
S 1 playing
S 2 defense
S 3 top
S 4 as-trump
S 5 possible
S 6 certain
M 0 club
M 1 diamond
M 2 heart
M 3 spade
M 4 notrump
6 1 VOID
6 2 BID
6 3 BIDNAME
6 4 BIDPOSITION
6 5 BIDROUND
6 6 BIDKIND
6 7 BOOLEAN
6 18 CARD
6 13 DISTRIBUTION
6 14 LENGTH
6 15 LEVEL
6 8 MAJOR
6 9 MINOR
6 20 PLAYER
6 17 POINT
6 28 RELFACTOR
6 23 SCORING
6 10 SUIT
6 27 SYMBOL
6 21 TEAM
6 16 TRICKS
6 11 TRUMP
6 12 INTEGER
6 19 VALUE
6 24 SUIT_VECTOR
6 25 PLAYER_VECTOR
a 6 bidround
a 6 dialoground
a 6 opponent_dialoground
a 6 bidposition
a 6 last_bidlevel
a 6 level_of
a 6 trump_of
a 6 bidder
a 6 last_suit_bid
a 6 current_declarer
a 6 own_suit
a 6 own_bid
a 6 pre_own_bid
a 6 partner_suit
a 6 partner_bid
a 6 pre_partner_bid
a 6 lho_suit
a 6 lho_bid
a 6 pre_lho_bid
a 6 rho_suit
a 6 rho_bid
a 6 pre_rho_bid
a 6 opponent_suit
a 6 opponent_bid
a 6 own_bidkind
a 6 partner_bidkind
a 6 lho_bidkind
a 6 rho_bidkind
a 6 opponent_bidkind
a 6 have_bidden_before_partner
a 6 I_have_bidden
a 6 partner_has_bidden
a 6 lho_has_bidden
a 6 rho_has_bidden
a 6 opponent_has_bidden
a 6 has_opened
a 6 has_bidden_since
a 6 has_real_bidden_since
a 6 has_ever_bidden
a 6 has_ever_real_bidden
a 6 becomes_declarer
a 6 is_start_bidding_sequence
a 6 is_exact_bidding_sequence
a 6 is_opponent_start_bidding_sequence
a 6 is_opponent_exact_bidding_sequence
a 6 is_all_start_bidding_sequence
a 6 is_all_exact_bidding_sequence
a 6 vulnerable
a 6 scoring
a 6 is_game
a 6 other_major
a 6 other_minor
a 6 one_lower
a 6 two_lower
a 6 one_higher
a 6 two_higher
a 6 is_between
a 6 protocol_on
a 6 parse_mode
a 6 iteration
a 6 this_suit
a 6 this_level
a 6 set_new_info
a 6 unset_new_info
a 6 bid_found
a 6 bid_found_0
a 6 not_bid_found
a 6 not_bid_found_0
a 6 bid_until_now
a 6 high_card_points
a 6 set_high_card_points
a 6 additional_high_card_points
a 6 set_additional_high_card_points
a 6 set_min_high_card_points
a 6 set_max_high_card_points
a 6 set_high_card_point_range
a 6 min_high_card_points
a 6 max_high_card_points
a 6 suit_high_card_points
a 6 mod_suit_high_card_points
a 6 set_suit_high_card_points
a 6 additional_suit_high_card_points
a 6 set_additional_suit_high_card_points
a 6 total_points
a 6 set_total_points
a 6 additional_total_points
a 6 set_additional_total_points
a 6 set_min_total_points
a 6 set_max_total_points
a 6 set_total_point_range
a 6 min_total_points
a 6 max_total_points
a 6 set_no_nt_range
a 6 set_no_2nt_min
a 6 length
a 6 set_length
a 6 additional_length
a 6 set_additional_length
a 6 set_min_length
a 6 set_max_length
a 6 set_length_range
a 6 set_rho_length_range
a 6 set_partner_length_range
a 6 set_lho_length_range
a 6 min_length
a 6 max_length
a 6 set_any_void
a 6 set_any_single
a 6 shorter_major
a 6 longer_major
a 6 shorter_minor
a 6 longer_minor
a 6 partner_high_card_points
a 6 partner_min_high_card_points
a 6 partner_max_high_card_points
a 6 set_partner_hcp_range
a 6 partner_suit_high_card_points
a 6 partner_total_points
a 6 partner_min_total_points
a 6 partner_max_total_points
a 6 partner_length
a 6 partner_min_length
a 6 partner_max_length
a 6 our_high_card_points
a 6 set_our_high_card_points
a 6 our_min_high_card_points
a 6 our_max_high_card_points
a 6 set_our_min_high_card_points
a 6 set_our_max_high_card_points
a 6 set_our_high_card_point_range
a 6 our_suit_high_card_points
a 6 set_our_suit_high_card_points
a 6 our_total_points
a 6 set_our_total_points
a 6 our_min_total_points
a 6 our_max_total_points
a 6 set_our_min_total_points
a 6 set_our_max_total_points
a 6 set_our_total_point_range
a 6 our_length
a 6 our_min_length
a 6 our_max_length
a 6 set_our_length
a 6 set_our_min_length
a 6 set_our_max_length
a 6 set_our_length_range
a 6 lho_high_card_points
a 6 lho_min_high_card_points
a 6 lho_max_high_card_points
a 6 lho_suit_high_card_points
a 6 lho_total_points
a 6 lho_length
a 6 lho_min_length
a 6 lho_max_length
a 6 rho_high_card_points
a 6 rho_min_high_card_points
a 6 rho_max_high_card_points
a 6 rho_suit_high_card_points
a 6 rho_total_points
a 6 rho_length
a 6 rho_min_length
a 6 rho_max_length
a 6 longest_suit
a 6 second_longest_suit
a 6 shortest_suit
a 6 second_shortest_suit
a 6 partner_longest_suit
a 6 lho_longest_suit
a 6 rho_longest_suit
a 6 distribution
a 6 partner_distribution
a 6 lho_distribution
a 6 rho_distribution
a 6 set_suit_lengths
a 6 suit_lengths
a 6 partner_suit_lengths
a 6 lho_suit_lengths
a 6 rho_suit_lengths
a 6 tricks
a 6 suit_tricks
a 6 our_tricks
a 6 our_suit_tricks
a 6 losers
a 6 partner_losers
a 6 suit_losers
a 6 partner_suit_losers
a 6 our_losers
a 6 our_suit_losers
a 6 contains
a 6 partner_contains
a 6 set_contains
a 6 first_round_control
a 6 set_first_round_control
a 6 partner_first_round_control
a 6 second_round_control
a 6 set_second_round_control
a 6 partner_second_round_control
a 6 set_no_control
a 6 next_1_control
a 6 set_next_1_control
a 6 next_2_1_control
a 6 set_next_2_1_control
a 6 number_honours_to
a 6 set_number_honours_to_range
a 6 number
a 6 partner_number
a 6 set_number
a 6 set_alternative_number
a 6 set_excl_number
a 6 set_excl_alternative_number
a 6 set_keycard_number
a 6 set_keycard_alternative_number
a 6 set_excl_keycard_number
a 6 set_excl_keycard_alternative_number
a 6 set_ace_roman
a 6 set_king_roman
a 6 number_high_controls
a 6 set_min_number_high_controls
a 6 set_max_number_high_controls
a 6 number_controls
a 6 set_min_number_controls
a 6 note_stopper
a 6 note_strict_border
a 6 is_better
a 6 is_best_suit
a 6 is_best_high_suit
a 6 is_better_major
a 6 is_better_minor
a 6 is_total_better
a 6 is_our_best_suit
a 6 is_our_best_high_suit
a 6 is_our_better_major
a 6 is_our_better_minor
a 6 is_opening_bid
a 6 is_overcall
a 6 set_opening_bid
a 6 set_overcall
a 6 set_no_overcall
a 6 TPS
a 6 MLENS
a 6 hcp-outside
a 6 MSTOPS
a 6 nr-ace
a 6 nr-AK
a 6 nr-AKQ
a 6 nr-AKQJ
a 6 nr-AKQJT
a 6 nr-AKQJT9
a 6 diff-len
a 6 diff-modlen
a 6 set_suit_rel
a 6 set_and_suit_rel
a 6 set_and_and_suit_rel
a 6 set_longer
a 6 set_mod_longer
a 6 max2
a 6 min2
a 6 max3
a 6 min3
a 6 pseudo_random
a 6 jump
a 6 step
a 6 set_point_display
a 6 optim
a 12 U-simpler-counting
a 12 U-avoid-artif-bids
a 12 B-strong-artificial
a 12 bid-1C
a 12 min-hcp-16
a 12 min-hcp-17
a 12 bid-2C
a 12 forcing-until-3MA
a 12 forcing-until-3NT
a 12 Benjamin
a 12 modified-Benjamin
a 12 B-Moscito
a 12 B-1MA-5-cards
a 12 all-seats
a 12 first-2-seats
a 12 guaranted
a 12 spades-only
a 12 B-1D-promises-4
a 12 B-1C-forcing
a 12 B-1MI-prefer
a 12 minor-general
a 12 minor-when-strong
a 12 spades-over-clubs
a 12 clubs-over-diamonds
a 12 B-1-suit
a 12 style
a 12 strict-opening
a 12 light-opening
a 12 major-lighter
a 12 B-1NT
a 12 v-1
a 12 min-hcp
a 12 p11
a 12 p12
a 12 p13
a 12 p14
a 12 p15
a 12 p16
a 12 max-hcp
a 12 p17
a 12 p18
a 12 nv-1
a 12 v-2
a 12 nv-2
a 12 v-3
a 12 nv-3
a 12 v-4
a 12 nv-4
a 12 B-1NT-style
a 12 weak-6-minor
a 12 any-6-minor
a 12 no-5-card-major
a 12 weak-5-heart
a 12 any-5-heart
a 12 weak-5-spade
a 12 any-5-spade
a 12 allow-5-4-half-stop
a 12 allow-5-4-no-stop
a 12 B-2D
a 12 weak
a 12 first-3-seats
a 12 strong
a 12 variable-2-2
a 12 strong-is-forcing
a 12 strong-three-suiter
a 12 solely
a 12 plus-strong-balanced
a 12 Crowhurst
a 13 Flannery
a 12 Precision
a 12 majors-4-4
a 12 majors-4-3
a 13 Multi
a 12 weak-major-only
a 12 plus-strong-three-suiter
a 13 both-majors-weak
a 12 B-2D-balanced-2NT-rebid
a 12 range-19-20
a 12 range-20-21
a 12 range-21-22
a 12 range-22-23
a 12 range-23-24
a 12 range-24-25
a 12 B-2MA
a 12 weak-5-and-4-minor
a 12 B-2MA-weak-style
a 12 strict
a 12 loose
a 12 B-2H
a 12 B-2S
a 13 minor-preempt
a 13 any-preempt
a 12 B-2NT
a 12 strong-balanced
a 12 widened-range
a 12 both-minors
a 12 B-3MI-style
a 12 B-3NT
a 12 gambling
a 12 B-4MI-SA-Texas
a 12 B-4MA-6-cards-possible
a 12 B-4NT
a 12 solid-minor
a 12 ACOL
a 12 B-5MI
a 12 preemptive
a 12 G-preempt-style
a 12 G-preempt-pos3-style
a 12 A-artificial-1C
a 12 unlimited-1NT
a 12 A-artificial-2C
a 12 negative-2D
a 12 strong-suit-positive
a 12 neutral-2H
a 12 semi-automatic-2D
a 12 ace-showing
a 12 A-use-second-negative
a 12 R-Benjamin-2C-3NT
a 12 long-clubs
a 12 majors-5-5
a 12 A-jump-shift-to-2
a 12 is-very-strong
a 12 denies-support
a 12 A-jump-shift-to-3
a 12 A-1C-prefer-major
a 12 A-1C-prefer-shorter-major
a 12 A-1C-1NT
a 12 range-6-9
a 12 range-6-10
a 12 range-7-10
a 12 range-8-10
a 12 range-10-12
a 12 A-1C-2NT
a 12 range-11-12
a 12 range-13-15
a 12 support-5
a 12 forcing-raise
a 12 A-1D-2NT
a 12 A-1C-passed-2NT
a 12 A-1D-passed-2NT
a 12 A-1MI-1H-possible-4H-5S
a 12 A-1MI-inverted-raises
a 12 only-nodouble
a 12 after-double
a 12 after-overcall
a 12 A-1MI-double-jump
a 12 splinter
a 12 has-stopper
a 12 A-1MI-quick-3NT
a 12 A-1MI-Truscott-2NT
a 12 A-1MI-2MA
a 12 unpassed-nodouble
a 12 is-strong
a 12 is-weak
a 12 is-fit
a 12 unpassed-double
a 12 passed-nodouble
a 12 passed-double
a 12 A-1C-2D
a 12 is-forcing-raise
a 12 is-weak-raise
a 12 A-1D-3C
a 12 A-1MA-forcing-1NT
a 12 A-1MA-forcing-1NT-spades-only
a 12 A-1MA-wide-1NT
a 12 A-1MA-1NT-min-support
a 12 points-6
a 12 points-7
a 12 A-1MA-2NT
a 12 support-3-11-12
a 12 support-3-10-13
a 12 support-4-strong
a 12 support-3-or-4
a 12 A-1MA-Truscott-2NT
a 12 A-1MA-Truscott-3NT
a 12 always
a 12 A-1MA-3-raise-promises-4-cards
a 12 A-1MA-forcing-3-raise
a 12 A-1MA-splinter
a 12 A-1MA-4oM-nat
a 12 A-1MA-Drury
a 12 is-2C
a 12 is-2C-reverse
a 12 A-1MA-passed-1NT-wide
a 12 A-1MA-passed-2NT
a 12 minors-5-5
a 12 support-3
a 12 support-4
a 12 A-1MA-Bergen-3C
a 12 range-8-11
a 12 range-11-13
a 12 range-10-13
a 12 A-1MA-3MI
a 12 is-Bergen
a 12 A-1H-2S
a 12 A-1S-3H
a 12 A-1MA-X
a 12 two-bids-forcing
a 12 other-major-as-support
a 12 two-clubs-constructive-3
a 12 two-clubs-strong-3
a 12 two-diamonds-constructive-4
a 12 two-diamonds-constructive-3
a 12 A-2-over-1-min
a 12 hcp-9
a 12 hcp-10
a 12 hcp-11
a 12 A-2-over-1-prefer-clubs
a 12 A-1NT-Stayman
a 12 A-1NT-Garbage-Stayman
a 12 A-1NT-2C-major-4-4
a 12 answer-2H
a 12 answer-2NT
a 12 answer-better-major
a 12 A-1NT-two-way-Stayman
a 12 weak-NT
a 12 A-1NT-5-major-always
a 12 A-1NT-artif-dbl-2NT-unusual
a 12 A-1NT-Jacoby-transfer
a 12 strong-NT
a 12 A-1NT-Jacoby-minor
a 12 spades-for-minors
a 12 spades-for-minor
a 12 spades-for-notrump
a 12 spades-for-clubs
a 12 notrump-for-minor
a 12 notrump-for-clubs
a 12 notrump-for-diamonds
a 12 clubs-for-diamonds
a 12 A-1NT-Jacoby-plus
a 12 Smolen
a 12 anti-lemming
a 12 direct-3MA-both-majors
a 12 direct-3MA-shows-6
a 12 direct-3MA-is-preemptive
a 12 direct-3MA-is-three-suiter
a 12 A-1NT-3-minor
a 12 is-preemptive
a 12 is-inviting
a 12 is-forcing
a 12 is-a-three-suiter
a 12 A-1NT-2C-x-3-minor
a 12 A-1NT-transfer-level-4
a 12 SA-Texas
a 12 Texas
a 12 A-1NT-4D-both-majors
a 12 A-2MA-3MI
a 12 is-lead
a 12 A-2H-2S
a 12 A-2S-3H
a 12 A-2MA-2NT
a 12 is-simple
a 12 feature-showing
a 12 Ogust
a 12 Ogust-6-B
a 12 Ogust-5-A
a 12 Ogust-5-B
a 12 is-4H-S-splinter
a 12 A-2NT
a 12 Stayman
a 12 Puppet-Stayman
a 13 Baron
a 12 A-2NT-transfer-level-3
a 12 Flint
a 12 below-1
a 12 accept-is-fit
a 12 A-2NT-transfer-level-4
a 12 A-2NT-4D-both-majors
a 12 A-2NT-3C-major-4-4
a 12 answer-3H
a 12 answer-3NT
a 12 A-3NT-Gerber
a 12 A-3NT-transfer
a 12 R-1-1-three-card-raise-possible
a 12 R-1-1-1NT
a 12 hcp-range-2
a 12 hcp-range-3
a 12 hcp-range-4
a 12 hcp-range-5
a 12 R-1H-1S-1NT
a 12 as-with-diamonds
a 12 range-12-14
a 12 range-12-15
a 12 R-1-1-2NT
a 12 range-17-18
a 12 range-18-19
a 12 R-1H-1S-2NT
a 12 R-1MA-2-2NT
a 12 wide
a 12 R-splinter-above-reverse
a 12 R-1H-1S-2C-forcing
a 12 R-1MA-1NT-2C-forcing
a 12 G-new-minor-forcing
a 12 G-checkback
a 12 answer-natural
a 12 answer-relay
a 12 answer-relay-2
a 12 answer-steps-A
a 12 answer-steps-B
a 12 G-fourth-suit-forcing
a 12 G-1C-1D-1H-1S-artif
a 12 G-third-suit-forcing
a 12 G-Wolff-signoff
a 12 G-2NT-new-minor-forcing
a 12 G-2NT-checkback
a 12 answer-steps
a 12 G-2NT-3y-is-weak
a 12 G-trial-bid
a 12 short-suit
a 12 help-suit
a 12 long-suit
a 12 G-weak-reraise
a 12 G-trial-bid-to-3NT
a 12 G-use-asking-bids
a 12 trump-asking
a 12 all-asking
a 12 O-Overcall
a 12 light
a 12 O-simple-cue-agrees
a 12 O-R-level-1-forcing
a 12 O-Polish-1NT
a 12 O-Polish-1NT-major-suits
a 12 O-Polish-1NT-passed
a 12 O-Polish-1NT-passed-major-suits
a 12 O-Weak-Jump-Overcall
a 12 all-suits
a 12 major-suits
a 12 O-2MA-2NT-is-artif
a 12 O-P-1MI-2MA-denies-other-major
a 12 O-P-1MA-3MI-denies-other-major
a 12 O-P-P-P-1MI-2MA
a 12 denies-other-major
a 12 promises-other-major
a 12 O-P-P-P-1MA-3MI
a 12 O-P-P-P-1X-1NT-as-2NT
a 12 O-P-P-P-1MI-1NT-5C-5D
a 12 O-1x-dbl-rdbl-pass-penalty
a 12 suits-4
a 12 minors-4
a 12 minors-3
a 12 O-1x-dbl-pass-preempt
a 12 O-1x-dbl-1y-preempt
a 12 O-Unusual-Notrump
a 12 O-Michaels
a 12 O-Leaping-Michaels
a 12 O-Non-Leaping-Michaels
a 12 minor-suits
a 12 O-Ghestem
a 12 standard
a 12 not-3C
a 12 cue-is-majors
a 12 extended-over-minor
a 12 O-Jump-Cue-Bid
a 12 O-Jump-Cue-Bid-resp-dbl
a 12 O-Cue-is-one-suiter
a 12 over-major
a 12 over-minor
a 12 O-Sandwich
a 12 nt-artificial
a 12 s-opener-artificial
a 12 O-1S-1NT-2S-X
a 12 is-penalty
a 12 is-take-out-general
a 12 is-take-out-heart-minor
a 12 O-1S-1NT-2S-p-p-X
a 12 O-1S-1NT-p-p-X
a 12 O-1H-1NT-2H-X
a 12 is-take-out-spade-minor
a 12 O-1H-1NT-2H-p-p-X
a 12 O-1H-1NT-p-p-X
a 12 O-1D-1NT-2D-X
a 12 is-take-out-majors
a 12 O-1D-1NT-2D-p-p-X
a 12 O-1C-1NT-2C-X
a 12 O-1C-1NT-2C-p-p-X
a 12 O-1MI-1NT-2MI-2MA
a 12 is-one-suiter
a 12 is-two-suiter
a 12 O-1MI-1NT-2MI-p-p-2MA
a 12 O-1mi-P-P-dbl-2mi-dbl-is-take-out
a 12 O-1ma-P-P-dbl-2ma-dbl-is-take-out
a 12 O-1NT
a 13 Landy
a 12 Multi-Landy
a 13 Astro
a 12 Asptro
a 12 Cappelletti
a 12 DONT
a 12 O-1NT-pos4
a 12 all-natural
a 12 O-1NT-x-pos2
a 12 is-penalty-with-major
a 12 one-suiter
a 12 minor-major
a 12 minor-spades
a 12 O-1NT-x-pos4
a 12 O-1NT-x-passed-is-pos4
a 12 O-1NT-x-notpassed-is-pos2
a 12 O-1NT-2CL-x-pass
a 12 is-clubs
a 12 is-query
a 12 O-1NT-2CL-x-rdbl
a 12 O-1NT-2CL-2D
a 12 dbl-is-query
a 12 O-1NT-2DML-x-pass
a 12 is-diamonds
a 12 O-1NT-2DML-x-rdbl
a 12 O-1NT-2DML-x-2ma-is-natural
a 12 O-1NT-2DML-2NT-3H3S-reversed
a 12 O-1NT-2MA-2NT
a 12 is-forcing-natural
a 12 is-forcing-artif
a 12 O-2NT-dbl-is-majors
a 12 O-2NT-3mi-plus-spades
a 12 O-2NT-4mi-plus-hearts
a 12 O-strong-1C
a 12 dbl-is-majors
a 12 CRASH
a 12 Truscott
a 12 O-strong-2C
a 12 O-strong-2D
a 12 C-Sputnik
a 12 until-1S
a 12 until-2D
a 12 until-2H
a 12 until-2S
a 12 until-3D
a 12 until-3H
a 12 until-3S
a 12 until-4D
a 12 until-4H
a 12 C-1C-1D-dbl
a 12 shows-majors
a 12 shows-hearts
a 12 denies-majors
a 12 C-1MI-1H-dbl
a 12 shows-spades
a 12 denies-spades
a 12 C-1MI-1S-2MI-is-hearts
a 12 C-cue-bid-game-forcing
a 12 C-negative-free-bid
a 12 C-weak-jump
a 12 C-1NT-doubled
a 12 all-escape
a 12 Stayman-only
a 12 Jacoby-only
a 12 Stayman-and-Jacoby
a 12 C-1NT-doubled-artif-like-penalty
a 12 C-1NT-doubled-rdbl-escape
a 12 C-1NT-doubled-pass-forcing
a 12 C-1NT-doubled-self-rdbl-5suit
a 12 C-1NT-takeout
a 12 after-nat-2
a 12 after-nat-3
a 12 C-1NT-Landy-2ma
a 12 is-stopper
a 12 is-minors
a 12 C-1NT-Landy-3ma
a 12 is-splinter
a 12 C-1NT-2DML-2ma
a 12 C-1-1NT-2C-majors
a 12 C-1-1NT-opener-take-out-double
a 12 C-Lebensohl
a 12 after-1NT
a 12 after-1NT-artif
a 12 after-weak-2
a 12 after-raise-to-2
a 12 C-cue-double-is-strong
a 12 C-responsive-double
a 12 C-competitive-double
a 12 C-support-double
a 12 C-1x-1y-dbl-3x-weak
a 12 C-optional-double
a 12 C-prefer-penalty-double
a 12 C-unassuming-cue-bids
a 12 S-investigation
a 12 likely-slams-only
a 12 S-control-asking
a 12 after-artificial-1C
a 12 after-preempts
a 12 S-Cue-Bids
a 12 are-used
a 12 first-round-controls-only
a 12 may-use-4NT
a 12 S-Splinter-no-void
a 12 S-Gerber
a 12 classic
a 12 roman
a 12 keycard
a 12 S-Blackwood
a 12 five-aces
a 12 RKCB0314
a 12 RKCB1403
a 12 RKCB1403-majors-only
a 12 S-Malowan
a 12 new-convention-01
a 12 new-convention-02
a 12 new-convention-03
a 12 new-convention-04
a 2 suggestion-1
a 2 suggestion-2
a 2 suggestion-3
a 2 trump-suit
a 2 partner-suggestion-1
a 2 partner-suggestion-2
a 2 partner-suggestion-3
a 2 own-call-1
a 2 own-call-2
a 2 own-call-3
a 2 partner-call-1
a 2 partner-call-2
a 2 partner-call-3
a 2 opponent-call-1
a 2 opponent-call-2
a 2 opponent-call-3
a 2 opponent-call-last
a 2 opponent-call-before
a 2 partner-call-last
a 2 our-call-last
a 2 new-suggestion
a 2 fourth-suit
a 2 fourth-suit-1
a 2 promised-suit-1
a 2 promised-suit-2
a 2 promised-suit-3
a 2 single-suit
a 2 control-suit
a 2 control-suit-1
a 2 control-suit-2
a 2 our-best-suit
a 2 best-additional-suit
a 2 best-suit
a 2 temp-own-call-1
a 2 possible-suit-1
a 2 possible-suit-2
a 2 possible-suit-3
a 2 best-possible-suit
a 2 suit-questioned
a 2 artificial-suit
a 2 major-suit
a 2 h-suit
a 2 weak-suit-1
a 2 weak-suit-2
a 2 weak-suit-3
a 2 strong-suit-1
a 2 strong-suit-2
a 2 strong-suit-3
a 2 fit-suit-1
a 2 fit-suit-2
a 2 fit-suit-3
a 2 lead-suit-1
a 2 lead-suit-2
a 2 lead-suit-3
a 2 Bergen-suit-1
a 2 Bergen-suit-2
a 2 take-out-supp-suit-1
a 2 take-out-supp-suit-2
a 2 take-out-supp-suit-3
a 2 take-out-short-suit-1
a 2 take-out-short-suit-2
a 2 take-out-short-suit-3
a 2 unbid-major
a 2 assumed-opp-call
a 2 poss-short-suit
a 2 curr-trump
a 2 opponent-suit-lower
a 2 opponent-suit-higher
a 2 change-suit
a 2 natural-dialoground
a 2 notrump-dialoground
a 2 according-opp-rules
a 2 sit-dealt-with
a 2 is-specific
a 2 is-2NT-natural
a 2 is-2NT-forcing
a 2 real-minimal
a 2 can-now
a 2 should-now
a 2 is-now
a 2 must-now
a 2 prefer-now
a 2 prefer-major
a 2 prefer-NT
a 2 prefer-wait
a 2 have-now
a 2 has-now-6
a 2 flag-1
a 2 flag-2
a 2 flag-3
a 2 can-now-penalty
a 2 can-now-sputnik
a 2 can-now-support
a 2 can-now-length
a 2 can-now-values
a 2 can-now-cue
a 2 can-now-pass
a 2 can-now-force
a 2 can-now-4MA
a 2 can-stop
a 2 can-ignore
a 2 too-strong
a 2 have-now-slam
a 2 have-now-balanced
a 2 have-now-forcing-raise
a 2 have-now-artif-2N
a 2 show-now-S
a 2 can-now-H
a 2 can-now-S
a 2 can-now-NT
a 2 can-now-3
a 2 is-now-penalty
a 2 is-now-support
a 2 is-now-length
a 2 is-now-sputnik
a 2 is-now-sputnik-for-major
a 2 is-now-sputnik-for-hearts
a 2 is-now-sputnik-for-minor
a 2 is-now-optional
a 2 is-now-forcing
a 2 is-now-wide
a 2 is-now-notrump
a 2 is-now-values
a 2 is-now-negative
a 2 is-now-lebensohl
a 2 is-now-scrambling
a 2 is-now-5-card-major
a 2 is-now-strong-2MA
a 2 is-now-weak-2MA
a 2 is-now-strong-2D
a 2 is-now-weak-2D
a 2 is-now-strict-3MI
a 2 is-now-crash
a 2 is-now-Truscott
a 2 is-now-Truscott-3N
a 2 is-now-Bergen
a 2 is-now-artificial
a 2 is-opp-1-natural
a 2 was-artif-1S
a 2 was-natural-1S
a 2 is-no-convention
a 2 is-Landy
a 2 is-Multi-Landy
a 2 is-Astro
a 2 is-Asptro
a 2 is-Capp
a 2 is-DONT
a 2 is-X-penalty-strong
a 2 is-X-penalty-suggest
a 2 is-X-penalty-major
a 2 is-X-one-suiter
a 2 is-X-minor-major
a 2 is-X-minor-spades
a 2 is-3mi-forcing
a 2 have-X-penalty-strong
a 2 have-X-penalty-suggest
a 2 have-X-penalty-major
a 2 have-X-one-suiter
a 2 have-X-minor-major
a 2 have-X-minor-spades
a 2 have-a-normal-3MA-preempt
a 2 have-a-weak-3MA-preempt
a 2 have-a-good-3MI-preempt
a 2 have-a-weak-3MI-preempt
a 2 have-a-average-3MI-preempt
a 2 have-opp-suit
a 2 is-artif-1N
a 2 is-artif-2O
a 2 is-artif-2R
a 2 is-real-C
a 2 is-real-D
a 2 is-now-2-suiter
a 2 is-pa-suit
a 2 is-own-major
a 2 is-opp-major
a 2 is-esc-Stayman
a 2 is-esc-Jacoby
a 2 is-esc-natural
a 2 is-esc-redouble
a 2 is-pass-forcing
a 2 opponents-are-weak
a 2 should-bid-on
a 2 make-choice-3L
a 2 was-support
a 2 best-additional-values
a 2 sum-controls
a 2 factor-cannot-stand
a 2 factor-chance-game
a 2 factor-h
a 2 factor-i
a 2 factor-j
a 2 factor-k
a 2 factor-l
a 2 factor-m
a 2 c-length
a 2 basis-points
a 2 our-better-major
a 2 our-better-minor
a 2 stopper
a 2 half-stopper
a 2 limited-hand
a 2 opening-bid
a 2 mod-partner-bid
a 2 minimum-contract
a 2 opponent-contract
a 2 optimum-contract
a 2 optimum-contract-l
a 2 optim-bid
a 2 first-natural-bid
a 2 last-bid
a 2 last-opp-bid
a 2 higher-bid
a 2 lower-bid
a 2 val-cue-bid-0
a 2 val-cue-bid-1
a 2 val-cue-bid-2
a 2 now-bid
a 2 use-bid
a 2 possible-major-contract
a 2 possible-minor-contract
a 2 possible-NT-contract
a 2 our-highest-possible-contract
a 2 NT-opener
a 2 cue-bid-opener
a 2 role-answerer
a 2 forcing-rebidder
a 2 follow-undisturbed
a 2 number-partner-majors
a 2 limit-1-opening
a 2 min-hcp-open-1nt
a 2 max-hcp-open-1nt
a 2 exp-hcp-1nt
a 2 min-hcp-1nt
a 2 max-hcp-1nt
a 2 exp-hcp-2ma
a 2 exp-hcp-2nt
a 2 exp-hcp-2d-2nt
a 2 exp-hcp-2c-2nt
a 2 exp-hcp-2x-2nt
a 2 min-hcp-2nt
a 2 max-hcp-2nt
a 2 min-hcp-3nt
a 2 partner-strength
a 2 lowerlimit-strong
a 2 mod-lowerlimit-strong
a 2 border-direct-raise
a 2 mod-points
a 2 add-points
a 2 minus-points
a 2 range-1
a 2 range-2
a 2 min-hcp-r-1nt
a 2 max-hcp-r-1nt
a 2 min-hcp-r-2nt
a 2 max-hcp-r-2nt
a 2 assumed-min-hcp
a 2 shown-hcp
a 2 take-out-strong-hcp
a 2 factor-p
a 2 crash-step
a 2 truscott-step
a 2 steps-available
a 2 add-steps
a 2 have-a-major-1-suiter
a 2 have-a-minor-1-suiter
a 2 have-a-major-major-2-suiter
a 2 have-a-major-minor-2-suiter
a 2 have-a-minor-major-2-suiter
a 2 top-tricks
a 2 opponent-tricks
a 2 estimated-tricks
a 2 stopper-needed
a 2 possible-level
a 2 curr-level
a 2 weak-2MA-style
a 2 Value
a 2 suit
a 2 new-suit
a 2 other-suit
a 2 major
a 2 other-major
a 2 new-major
a 2 major-1
a 2 minor
a 2 other-minor
a 2 new-minor
a 2 minor-1
a 2 suit-1
a 2 suit-2
a 2 suit-3
a 2 suit-4
a 4 forcing
a 4 round
a 4 limit
a 4 game
a 4 memo-forcing
a 4 was-game-forcing
a 4 competition
a 4 c-bid
a 4 c-double
a 4 trump_agreed
a 4 rebid-at3-game-forcing
a 4 opened
a 4 o-natural
a 4 o-1-minor
a 4 o-1-major
a 4 o-2-minor
a 4 o-2-major
a 4 o-3-minor
a 4 o-3-major
a 4 o-other
a 4 o-notrump
a 4 o-1nt
a 4 o-2nt
a 4 o-3nt
a 4 o-notrump-x
a 4 o-artificial
a 4 o-1c
a 4 o-2c
a 4 o-2d
a 4 o-preempt
a 4 o-3nt-gambling
a 4 o-3nt-4-minor
a 4 o-4-minor
a 4 o-4-minor-texas
a 4 o-4-major
a 4 o-5-minor
a 4 o-freak
a 4 responded
a 4 weak-2-ma
a 4 overcalled
a 4 weak-2d
a 4 weak-3-mi
a 4 is_initialized
a 5 take-out-double
a 4 distributional
a 4 sputnik
a 4 take-out-follow
a 5 penalty-double
a 4 over-artificial
a 4 over-preempt
a 4 over-suit
a 4 over-nt
a 4 strength
a 5 optional-double
a 5 strength-redouble
a 4 NT_search
a 4 have_unknown_minor
a 4 two_suiter_search
a 4 slam-invitation
a 4 blackwood_question_asked
a 4 gerber_question_asked
a 4 josephine_question_asked
a 4 cue_bid_sequence
a 4 artificial_sequence
a 4 stayman_sequence
a 4 transfer_sequence
a 4 baron_sequence
a 4 is_garbage_stayman
a 4 crash_sequence
a 4 crash_rank
a 4 crash_color
a 4 crash_shape
a 4 truscott_sequence
a 4 Lebensohl_forced
a 4 bidding_end
a 4 waiting_point_2N
a 36 as-minor
a 38 as-4-major
a 40 as-5-major
a 42 as-reasonable-5
a 44 as-good-5
a 46 as-strong-5
a 48 as-good-6
a 50 as-strong-6
a 52 as-good-7
a 54 as-standing-6
a 56 as-strong-7
a 58 as-standing-7
a 32 minimum
a 34 just
a 36 fair
a 38 good
a 40 fit-9
a 42 excellent
a 44 superb
a 34 style_strict
a 36 style_average
a 38 style_loose
a 32 stopper-dont-know
a 34 stopper-likely-no
a 38 stopper-sure-no
a 44 stopper-likely-yes
a 48 stopper-sure-yes
a 52 stopper-penalty
a 34 border-strict-lower
a 36 border-strict-upper
a 42 border-strict-lower-opp
a 52 border-strict-upper-opp
a 34 display-hcp-only
a 36 display-hcp-also
a 40 display-ntp-only
a 48 display-ntp-also
a 10 get_additional_values
a 10 mod_length
a 10 partner_mod_length
a 10 my_partner
a 10 our_max_equiv_length
a 10 number_top_honours
a 10 set_number_top_honours
a 0 val
a 10 set_our_save_min_length
a 0 len
a 10 set_balanced_range
a 0 allow-6-minor
a 10 set_no_stayman
a 10 limit_other_lengths
a 10 deny_4_major
a 10 deny_5_major
a 10 set_exact_length
a 10 set_exact_lengths
a 0 length-S
a 0 length-H
a 0 length-D
a 0 length-C
a 10 bid_steps
a 0 bid1
a 0 bid2
a 10 is_an_own_suit
a 10 is_longer_own_suit
a 10 is_a_pa_suit
a 10 is_longer_pa_suit
a 10 is_an_opp_suit
a 10 our_controls
a 10 our_assumed_playing_tricks
a 10 opp_assumed_tricks
a 10 deviation_from_take_out_distribution
a 0 suit-against
a 10 has_ace_or_king
a 10 keycard_number
a 10 excl_number
a 10 keycard_excl_number
a 10 slam_plus
a 10 number-called-suits
a 10 number-own-called-suits
a 10 number-partner-called-suits
a 10 number-opponent-called-suits
a 10 identify_void
a 0 only-higher
a 10 set_meaningful_void
a 10 suit_hcp_4321
a 10 high_card_points_4321
a 10 high_card_points_notrump
a 0 with-distribution
a 10 suit_high_card_points_defense
a 10 mod_length_defense
a 10 our_longest_suit
a 10 our_shortest_suit
a 10 set_full_stopper
a 0 is-sure
a 0 with-note
a 10 deny_full_stopper
a 10 set_half_stopper
a 10 is_shown_full_stopper
a 10 is_shown_pa_half_stopper
a 10 number-stopped-suits
a 10 number-noseq-king-or-queens
a 10 number-outside-short-honours
a 10 set_follow_undisturbed
a 10 set_suggestion
a 0 new-call
a 10 set_normal_opening_minimum
a 10 set_unknown_standing_minor
a 10 cancel_take_out_suits
a 10 set_take_out_info
a 0 hcp-strong
a 10 set_weak_take_out
a 10 set_strong_take_out
a 10 deny_low_singleton
a 10 set_cue_bid_opener
a 10 calc_factor_opp_suit
a 10 sum_factor_opp_suit
a 10 factor_opp_suit
a 10 set_number_controls_from_points
a 10 set_reduced_support
a 0 how_much
a 10 set_multi_major
a 0 player
a 10 set_have_prefered
a 10 set_at_most_one_outside_AK
a 10 set_all_aces
a 10 calc_nt_rebid_ranges
a 10 do_dummy_def
a 8 stops_opp_suit
a 8 half_stops_suit
a 8 stops_suit
a 8 stops_outside_suits
a 8 partner_stops_suit
a 0 is_opp
a 8 we_stop_opp_suits
a 8 we_stop_opp_suits_for_slam
a 8 we_stop_all_suits
a 8 balanced_distribution
a 8 weakly_balanced_distribution
a 8 balanced_5_4_distribution
a 0 with-stopper
a 8 deny_balanced_distribution
a 8 is_suitable
a 0 quality
a 8 supports_suit_len
a 0 partner_len
a 8 supports_suit
a 8 strength_for_3NT
a 0 discount
a 8 strength_for_3_level_suit_game
a 0 length-check
a 8 strength_below_3_level_suit_game
a 8 strength_for_4_level_suit_game
a 8 strength_for_5_level_suit_game
a 8 strength_for_suit_small_slam
a 0 check-losers
a 8 strength_for_6NT
a 8 strength_for_suit_grand_slam
a 8 strength_for_7NT
a 8 strength_for_contract
a 8 major_game_trial_strength
a 0 no-upper
a 8 is_inviting_3_minor
a 8 is_preemptive_3_minor
a 8 is_a_average_2MA_opening
a 8 is_a_strict_2MA_opening
a 8 is_a_loose_2MA_opening
a 8 is_a_2MA_opening
a 0 style_2MA
a 8 hand_can_overcall
a 8 have_a_compet_5_minor
a 0 allow-sidesuit
a 8 have_a_compet_4_major
a 8 have_a_compet_4_minor
a 8 have_a_compet_3_major
a 8 have_a_compet_3_minor
a 8 have_a_compet_2_major
a 8 have_a_compet_4_raise
a 8 have_a_better_major
a 8 draw_crash_conclusions
a 8 draw_Lebensohl_conclusions
a 8 has_additional_values
a 8 no_support
a 8 deny_major_fit
a 8 deny_good_major_fit
a 8 deny_better_contract
a 0 contract
a 8 is_single
a 8 is_penalty_min_length
a 8 have_take_out_doubled
a 1 sputnik-take-out
a 1 responsive-double
a 8 is_a_two_suiter
a 0 level
a 8 have_a_known_two_suiter
a 8 have_a_unknown_two_suiter
a 0 poss-suit-1
a 0 poss-suit-2
a 8 can_use_cue_bids
a 8 cue_control
a 0 cue-suit
a 8 next_cue_control
a 8 deny_cue_control
a 8 can_use_splinter
a 0 is-void
a 0 with-points
a 8 can_use_Blackwood
a 0 check_strength
a 8 can_use_Gerber
a 8 is_role_answerer
a 8 prefer_major_in_taking_out
a 8 prefer_in_taking_out
a 0 suit-a
a 0 suit-b
a 8 prefer_major_of_two_5
a 8 prefer_of_two_5
a 8 do_init_general
a 1 Lebensohl-2N
a 1 Lebensohl-3N
a 1 Lebensohl-relay
a 8 do_init_compet
a 8 do_fini_general
a 1 strong-1C
a 1 Sys-1C-negative
a 1 strong-2C
a 1 Sys-2C-negative
a 1 Unusual-Notrump
a 1 X-both-majors
a 1 forcing-1C-negative
a 1 non-forcing-Stayman
a 1 forcing-Stayman
a 1 Sys-2D-negative
a 1 PRC-short-D
a 1 both-minors-2NT
a 1 transfer-BM-3H
a 1 transfer-BM-3S
a 1 Gambling-3NT
a 1 transfer-G-4H
a 1 transfer-G-4S
a 1 Polish-1NT
a 1 Blackwood
a 1 splinter-bid
a 1 opp-cue-bid-agree
a 1 opp-cue-bid-general
a 1 Michaels
a 1 trial-bid-to-3NT
a 1 Ghestem
a 1 stopper-showing
a 1 jump-cue-bid-major
a 1 slam-cue-bid
a 1 transfer-2H
a 1 escape-transfer-2H
a 1 transfer-2S
a 1 escape-transfer-2S
a 1 Leaping-Michaels
a 1 double-of-transfer
a 1 Capp-2C
a 1 Capp-2D
a 1 Multi-Landy-2D
a 1 Multi-Landy-2C
a 1 Capp-2MA
a 1 DONT-2H
a 1 DONT-2D
a 1 DONT-2C
a 1 NT-one-suiter-double
a 1 NT-penalty-suggest
a 1 NT-penalty-major
a 1 NT-minor-suiter-double
a 1 NT-minor-major-double
a 1 NT-minor-spades-double
a 1 NT-major-suits-double
a 1 opp-cue-bid-Astro
a 1 minors-C-D
a 1 minors-D-C
a 1 opp-cue-bid-Landy
a 1 both-minors-2S
a 1 escape-Stayman
a 1 subst-Stayman
a 1 escape-transfer-3-minor
a 1 escape-transfer-3C
a 1 escape-transfer-2D
a 1 fit-searching-4
a 1 fit-searching-5
a 1 forcing-pass
a 1 NT-escape-redouble
a 1 NT-self-rescue-5
a 1 NT-self-rescue-4
a 1 search-cue-bid
a 1 automatic-double
a 1 Astro-2N
a 1 Astro-2D
a 1 Astro-wait
a 1 Astro-2H
a 1 Astro-2X-2N
a 1 Landy-2D
a 1 Multi-Landy-2N
a 1 Multi-Landy-4H
a 1 Multi-Landy-3S
a 1 Multi-Landy-3H
a 1 Capp-2C-2D
a 1 Multi-Landy-2D-2S
a 1 Multi-Landy-2D-2H
a 1 Query-4-major
a 1 Capp-2MA-2NT
a 1 DONT-X-2C
a 1 DONT-2C-2D
a 1 X-major-ask
a 1 X-minor-ask
a 1 Query-w2ma
a 1 SOS-Redouble
a 1 forced-redouble
a 1 Texas-transfer
a 1 strong-cue-bid
a 1 jump-cue-bid-minor
a 1 support-redouble-5
a 1 raise-is-hearts
a 1 jump-agreement
a 1 void-splinter
a 1 support-redouble
a 1 support-double-5
a 1 support-double
a 1 search-for-suit
a 1 minimal-answer
a 1 Michaels-ask
a 1 Scrambling-2N
a 1 strong-3-suits
a 1 strong-2-suits
a 1 show-lowest
a 1 a-strong-4-card-major
a 1 escape-to-NT
a 1 opp-cue-bid-resp-x
a 1 general-trial
a 1 short-suit-trial
a 1 long-suit-trial
a 1 competitive-double
a 1 half-stopper-trial
a 1 balanced-11-12
a 1 solid-minor-4NT
a 1 both-minors-4NT
a 1 ACOL-4NT
a 1 Benjamin-2D
a 1 minor-preempt-3NT
a 1 forcing-1C
a 1 balanced-13-15
a 1 five-card-support
a 1 forcing-C-raise
a 1 forcing-D-raise
a 1 Truscott-2N
a 1 Jacoby-2N
a 1 Truscott-3N
a 1 Bergen-Raise
a 1 Drury-2C
a 1 Fit3-2N
a 1 forcing-2C
a 1 relay-2C-2D
a 1 Drury-2C-2D-Min
a 1 Drury-2C-2D-Max
a 1 fourth-suit-forcing
a 1 Gerber
a 1 support-range-query
a 1 Bergen-Relay
a 1 minor-forcing
a 1 lead-directing
a 1 second-negative
a 1 Blackwood-for-kings
a 1 three-suiter
a 1 transfer-2S-minor
a 1 transfer-2S-weak-minor
a 1 transfer-2S-2NT
a 1 transfer-2NT-3-minor
a 1 transfer-2S-3C
a 1 transfer-2NT-3C
a 1 transfer-2NT-3D
a 1 transfer-3C-3D
a 1 transfer-4H
a 1 transfer-4S
a 1 Texas-transfer-4H
a 1 Texas-transfer-4S
a 1 transfer-4C-4D
a 1 transfer-3H
a 1 transfer-3S
a 1 transfer-3S-4-minor
a 1 transfer-3S-3NT
a 1 transfer-3S-4C
a 1 transfer-Flint
a 1 Stayman-2NT
a 1 Puppet-Stayman-2NT
a 1 Stayman-3NT
a 1 A-Texas-transfer-plus
a 1 Stayman-2N
a 1 Stayman-3C
a 1 re-transfer
a 1 query-minor
a 1 question-Zeta
a 1 Zeta-minimal-answer
a 1 question-Gamma
a 1 question-Alpha
a 1 question-Beta
a 1 question-Epsilon
a 1 major-transfer
a 1 N-transfer
a 1 N-transfer-C
a 1 question-Epsilon-honour
a 1 question-Theta
a 1 Sys-2C-neutral
a 1 Benjamin-both-majors
a 1 Benjamin-strong-C
a 1 Benjamin-strong-D
a 1 Query2-w2ma
a 1 resp-0-3
a 1 resp-1-4
a 1 Gerber-for-kings
a 1 Josephine
a 1 A-Alpha
a 1 A-Beta
a 1 A-Gamma
a 1 A-Theta
a 1 general-game-trial
a 1 major-major-trial
a 1 help-suit-trial
a 1 stopper-game-trial
a 1 stopper-doubt
a 1 Queen-ask
a 1 slam-stop
a 1 Gerber-follow
a 1 A-Gerber-follow
`;

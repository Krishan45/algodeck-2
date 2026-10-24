// AlgoDeck seed pool: 150 frequently asked LeetCode problems, grouped by topic.
//
// Built from NeetCode 150, LeetCode's Top Interview 150 and well-known binary
// search on answer lists. Premium-only (locked) problems are left out.
//
// Each row: [leetcode-slug, title, difficulty, topic]
// The slug is the part after /problems/ in the LeetCode URL.
//
// >>> To mark problems you have ALREADY solved, add their slugs to SOLVED_SLUGS
// >>> below. They start as "revise"; everything else starts as "new".
// >>> To add or remove problems, edit POOL. Delete the browser's localStorage
// >>> key "algodeck:v1" (or use Menu -> Reset) to re-seed from scratch.

export const PRIORITY_TOPIC = 'Binary Search on Answer'

export const SOLVED_SLUGS = [
  // 'two-sum',
  // 'koko-eating-bananas',
]

export const POOL = [
  // ---- Binary Search on Answer (16) ----
  ['koko-eating-bananas', 'Koko Eating Bananas', 'Medium', PRIORITY_TOPIC],
  ['capacity-to-ship-packages-within-d-days', 'Capacity To Ship Packages Within D Days', 'Medium', PRIORITY_TOPIC],
  ['split-array-largest-sum', 'Split Array Largest Sum', 'Hard', PRIORITY_TOPIC],
  ['minimum-number-of-days-to-make-m-bouquets', 'Minimum Number of Days to Make m Bouquets', 'Medium', PRIORITY_TOPIC],
  ['find-the-smallest-divisor-given-a-threshold', 'Find the Smallest Divisor Given a Threshold', 'Medium', PRIORITY_TOPIC],
  ['magnetic-force-between-two-balls', 'Magnetic Force Between Two Balls', 'Medium', PRIORITY_TOPIC],
  ['minimum-speed-to-arrive-on-time', 'Minimum Speed to Arrive on Time', 'Medium', PRIORITY_TOPIC],
  ['minimized-maximum-of-products-distributed-to-any-store', 'Minimized Maximum of Products Distributed to Any Store', 'Medium', PRIORITY_TOPIC],
  ['minimum-limit-of-balls-in-a-bag', 'Minimum Limit of Balls in a Bag', 'Medium', PRIORITY_TOPIC],
  ['minimum-time-to-complete-trips', 'Minimum Time to Complete Trips', 'Medium', PRIORITY_TOPIC],
  ['maximum-candies-allocated-to-k-children', 'Maximum Candies Allocated to K Children', 'Medium', PRIORITY_TOPIC],
  ['kth-smallest-number-in-multiplication-table', 'Kth Smallest Number in Multiplication Table', 'Hard', PRIORITY_TOPIC],
  ['find-k-th-smallest-pair-distance', 'Find K-th Smallest Pair Distance', 'Hard', PRIORITY_TOPIC],
  ['path-with-minimum-effort', 'Path With Minimum Effort', 'Medium', PRIORITY_TOPIC],
  ['sqrtx', 'Sqrt(x)', 'Easy', PRIORITY_TOPIC],
  ['kth-smallest-element-in-a-sorted-matrix', 'Kth Smallest Element in a Sorted Matrix', 'Medium', PRIORITY_TOPIC],

  // ---- Binary Search (8) ----
  ['binary-search', 'Binary Search', 'Easy', 'Binary Search'],
  ['search-a-2d-matrix', 'Search a 2D Matrix', 'Medium', 'Binary Search'],
  ['find-first-and-last-position-of-element-in-sorted-array', 'Find First and Last Position of Element in Sorted Array', 'Medium', 'Binary Search'],
  ['search-in-rotated-sorted-array', 'Search in Rotated Sorted Array', 'Medium', 'Binary Search'],
  ['find-minimum-in-rotated-sorted-array', 'Find Minimum in Rotated Sorted Array', 'Medium', 'Binary Search'],
  ['find-peak-element', 'Find Peak Element', 'Medium', 'Binary Search'],
  ['time-based-key-value-store', 'Time Based Key-Value Store', 'Medium', 'Binary Search'],
  ['median-of-two-sorted-arrays', 'Median of Two Sorted Arrays', 'Hard', 'Binary Search'],

  // ---- Arrays & Hashing (12) ----
  ['two-sum', 'Two Sum', 'Easy', 'Arrays & Hashing'],
  ['contains-duplicate', 'Contains Duplicate', 'Easy', 'Arrays & Hashing'],
  ['valid-anagram', 'Valid Anagram', 'Easy', 'Arrays & Hashing'],
  ['group-anagrams', 'Group Anagrams', 'Medium', 'Arrays & Hashing'],
  ['top-k-frequent-elements', 'Top K Frequent Elements', 'Medium', 'Arrays & Hashing'],
  ['product-of-array-except-self', 'Product of Array Except Self', 'Medium', 'Arrays & Hashing'],
  ['longest-consecutive-sequence', 'Longest Consecutive Sequence', 'Medium', 'Arrays & Hashing'],
  ['valid-sudoku', 'Valid Sudoku', 'Medium', 'Arrays & Hashing'],
  ['maximum-subarray', 'Maximum Subarray', 'Medium', 'Arrays & Hashing'],
  ['maximum-product-subarray', 'Maximum Product Subarray', 'Medium', 'Arrays & Hashing'],
  ['subarray-sum-equals-k', 'Subarray Sum Equals K', 'Medium', 'Arrays & Hashing'],
  ['majority-element', 'Majority Element', 'Easy', 'Arrays & Hashing'],

  // ---- Two Pointers (7) ----
  ['valid-palindrome', 'Valid Palindrome', 'Easy', 'Two Pointers'],
  ['two-sum-ii-input-array-is-sorted', 'Two Sum II - Input Array Is Sorted', 'Medium', 'Two Pointers'],
  ['3sum', '3Sum', 'Medium', 'Two Pointers'],
  ['container-with-most-water', 'Container With Most Water', 'Medium', 'Two Pointers'],
  ['trapping-rain-water', 'Trapping Rain Water', 'Hard', 'Two Pointers'],
  ['sort-colors', 'Sort Colors', 'Medium', 'Two Pointers'],
  ['move-zeroes', 'Move Zeroes', 'Easy', 'Two Pointers'],

  // ---- Sliding Window (8) ----
  ['best-time-to-buy-and-sell-stock', 'Best Time to Buy and Sell Stock', 'Easy', 'Sliding Window'],
  ['longest-substring-without-repeating-characters', 'Longest Substring Without Repeating Characters', 'Medium', 'Sliding Window'],
  ['longest-repeating-character-replacement', 'Longest Repeating Character Replacement', 'Medium', 'Sliding Window'],
  ['permutation-in-string', 'Permutation in String', 'Medium', 'Sliding Window'],
  ['minimum-window-substring', 'Minimum Window Substring', 'Hard', 'Sliding Window'],
  ['sliding-window-maximum', 'Sliding Window Maximum', 'Hard', 'Sliding Window'],
  ['minimum-size-subarray-sum', 'Minimum Size Subarray Sum', 'Medium', 'Sliding Window'],
  ['max-consecutive-ones-iii', 'Max Consecutive Ones III', 'Medium', 'Sliding Window'],

  // ---- Stack (9) ----
  ['valid-parentheses', 'Valid Parentheses', 'Easy', 'Stack'],
  ['min-stack', 'Min Stack', 'Medium', 'Stack'],
  ['evaluate-reverse-polish-notation', 'Evaluate Reverse Polish Notation', 'Medium', 'Stack'],
  ['daily-temperatures', 'Daily Temperatures', 'Medium', 'Stack'],
  ['car-fleet', 'Car Fleet', 'Medium', 'Stack'],
  ['largest-rectangle-in-histogram', 'Largest Rectangle in Histogram', 'Hard', 'Stack'],
  ['next-greater-element-ii', 'Next Greater Element II', 'Medium', 'Stack'],
  ['basic-calculator-ii', 'Basic Calculator II', 'Medium', 'Stack'],
  ['decode-string', 'Decode String', 'Medium', 'Stack'],

  // ---- Linked List (11) ----
  ['reverse-linked-list', 'Reverse Linked List', 'Easy', 'Linked List'],
  ['merge-two-sorted-lists', 'Merge Two Sorted Lists', 'Easy', 'Linked List'],
  ['linked-list-cycle', 'Linked List Cycle', 'Easy', 'Linked List'],
  ['linked-list-cycle-ii', 'Linked List Cycle II', 'Medium', 'Linked List'],
  ['reorder-list', 'Reorder List', 'Medium', 'Linked List'],
  ['remove-nth-node-from-end-of-list', 'Remove Nth Node From End of List', 'Medium', 'Linked List'],
  ['copy-list-with-random-pointer', 'Copy List with Random Pointer', 'Medium', 'Linked List'],
  ['add-two-numbers', 'Add Two Numbers', 'Medium', 'Linked List'],
  ['intersection-of-two-linked-lists', 'Intersection of Two Linked Lists', 'Easy', 'Linked List'],
  ['lru-cache', 'LRU Cache', 'Medium', 'Linked List'],
  ['reverse-nodes-in-k-group', 'Reverse Nodes in k-Group', 'Hard', 'Linked List'],

  // ---- Trees (15) ----
  ['invert-binary-tree', 'Invert Binary Tree', 'Easy', 'Trees'],
  ['maximum-depth-of-binary-tree', 'Maximum Depth of Binary Tree', 'Easy', 'Trees'],
  ['diameter-of-binary-tree', 'Diameter of Binary Tree', 'Easy', 'Trees'],
  ['balanced-binary-tree', 'Balanced Binary Tree', 'Easy', 'Trees'],
  ['subtree-of-another-tree', 'Subtree of Another Tree', 'Easy', 'Trees'],
  ['lowest-common-ancestor-of-a-binary-search-tree', 'Lowest Common Ancestor of a Binary Search Tree', 'Medium', 'Trees'],
  ['binary-tree-level-order-traversal', 'Binary Tree Level Order Traversal', 'Medium', 'Trees'],
  ['binary-tree-right-side-view', 'Binary Tree Right Side View', 'Medium', 'Trees'],
  ['validate-binary-search-tree', 'Validate Binary Search Tree', 'Medium', 'Trees'],
  ['kth-smallest-element-in-a-bst', 'Kth Smallest Element in a BST', 'Medium', 'Trees'],
  ['construct-binary-tree-from-preorder-and-inorder-traversal', 'Construct Binary Tree from Preorder and Inorder Traversal', 'Medium', 'Trees'],
  ['binary-tree-maximum-path-sum', 'Binary Tree Maximum Path Sum', 'Hard', 'Trees'],
  ['serialize-and-deserialize-binary-tree', 'Serialize and Deserialize Binary Tree', 'Hard', 'Trees'],
  ['lowest-common-ancestor-of-a-binary-tree', 'Lowest Common Ancestor of a Binary Tree', 'Medium', 'Trees'],
  ['count-good-nodes-in-binary-tree', 'Count Good Nodes in Binary Tree', 'Medium', 'Trees'],

  // ---- Tries (3) ----
  ['implement-trie-prefix-tree', 'Implement Trie (Prefix Tree)', 'Medium', 'Tries'],
  ['design-add-and-search-words-data-structure', 'Design Add and Search Words Data Structure', 'Medium', 'Tries'],
  ['word-search-ii', 'Word Search II', 'Hard', 'Tries'],

  // ---- Heap (6) ----
  ['kth-largest-element-in-an-array', 'Kth Largest Element in an Array', 'Medium', 'Heap'],
  ['k-closest-points-to-origin', 'K Closest Points to Origin', 'Medium', 'Heap'],
  ['task-scheduler', 'Task Scheduler', 'Medium', 'Heap'],
  ['find-median-from-data-stream', 'Find Median from Data Stream', 'Hard', 'Heap'],
  ['merge-k-sorted-lists', 'Merge k Sorted Lists', 'Hard', 'Heap'],
  ['last-stone-weight', 'Last Stone Weight', 'Easy', 'Heap'],

  // ---- Backtracking (9) ----
  ['subsets', 'Subsets', 'Medium', 'Backtracking'],
  ['permutations', 'Permutations', 'Medium', 'Backtracking'],
  ['combination-sum', 'Combination Sum', 'Medium', 'Backtracking'],
  ['combination-sum-ii', 'Combination Sum II', 'Medium', 'Backtracking'],
  ['word-search', 'Word Search', 'Medium', 'Backtracking'],
  ['palindrome-partitioning', 'Palindrome Partitioning', 'Medium', 'Backtracking'],
  ['letter-combinations-of-a-phone-number', 'Letter Combinations of a Phone Number', 'Medium', 'Backtracking'],
  ['generate-parentheses', 'Generate Parentheses', 'Medium', 'Backtracking'],
  ['n-queens', 'N-Queens', 'Hard', 'Backtracking'],

  // ---- Graphs (10) ----
  ['number-of-islands', 'Number of Islands', 'Medium', 'Graphs'],
  ['clone-graph', 'Clone Graph', 'Medium', 'Graphs'],
  ['max-area-of-island', 'Max Area of Island', 'Medium', 'Graphs'],
  ['pacific-atlantic-water-flow', 'Pacific Atlantic Water Flow', 'Medium', 'Graphs'],
  ['surrounded-regions', 'Surrounded Regions', 'Medium', 'Graphs'],
  ['rotting-oranges', 'Rotting Oranges', 'Medium', 'Graphs'],
  ['course-schedule', 'Course Schedule', 'Medium', 'Graphs'],
  ['course-schedule-ii', 'Course Schedule II', 'Medium', 'Graphs'],
  ['redundant-connection', 'Redundant Connection', 'Medium', 'Graphs'],
  ['word-ladder', 'Word Ladder', 'Hard', 'Graphs'],

  // ---- Advanced Graphs (4) ----
  ['network-delay-time', 'Network Delay Time', 'Medium', 'Advanced Graphs'],
  ['cheapest-flights-within-k-stops', 'Cheapest Flights Within K Stops', 'Medium', 'Advanced Graphs'],
  ['min-cost-to-connect-all-points', 'Min Cost to Connect All Points', 'Medium', 'Advanced Graphs'],
  ['swim-in-rising-water', 'Swim in Rising Water', 'Hard', 'Advanced Graphs'],

  // ---- 1-D DP (11) ----
  ['climbing-stairs', 'Climbing Stairs', 'Easy', '1-D DP'],
  ['min-cost-climbing-stairs', 'Min Cost Climbing Stairs', 'Easy', '1-D DP'],
  ['house-robber', 'House Robber', 'Medium', '1-D DP'],
  ['house-robber-ii', 'House Robber II', 'Medium', '1-D DP'],
  ['longest-palindromic-substring', 'Longest Palindromic Substring', 'Medium', '1-D DP'],
  ['palindromic-substrings', 'Palindromic Substrings', 'Medium', '1-D DP'],
  ['decode-ways', 'Decode Ways', 'Medium', '1-D DP'],
  ['coin-change', 'Coin Change', 'Medium', '1-D DP'],
  ['word-break', 'Word Break', 'Medium', '1-D DP'],
  ['longest-increasing-subsequence', 'Longest Increasing Subsequence', 'Medium', '1-D DP'],
  ['partition-equal-subset-sum', 'Partition Equal Subset Sum', 'Medium', '1-D DP'],

  // ---- 2-D DP (7) ----
  ['unique-paths', 'Unique Paths', 'Medium', '2-D DP'],
  ['longest-common-subsequence', 'Longest Common Subsequence', 'Medium', '2-D DP'],
  ['coin-change-ii', 'Coin Change II', 'Medium', '2-D DP'],
  ['target-sum', 'Target Sum', 'Medium', '2-D DP'],
  ['edit-distance', 'Edit Distance', 'Medium', '2-D DP'],
  ['best-time-to-buy-and-sell-stock-with-cooldown', 'Best Time to Buy and Sell Stock with Cooldown', 'Medium', '2-D DP'],
  ['maximal-square', 'Maximal Square', 'Medium', '2-D DP'],

  // ---- Greedy (5) ----
  ['jump-game', 'Jump Game', 'Medium', 'Greedy'],
  ['jump-game-ii', 'Jump Game II', 'Medium', 'Greedy'],
  ['gas-station', 'Gas Station', 'Medium', 'Greedy'],
  ['hand-of-straights', 'Hand of Straights', 'Medium', 'Greedy'],
  ['partition-labels', 'Partition Labels', 'Medium', 'Greedy'],

  // ---- Intervals (4) ----
  ['merge-intervals', 'Merge Intervals', 'Medium', 'Intervals'],
  ['insert-interval', 'Insert Interval', 'Medium', 'Intervals'],
  ['non-overlapping-intervals', 'Non-overlapping Intervals', 'Medium', 'Intervals'],
  ['minimum-number-of-arrows-to-burst-balloons', 'Minimum Number of Arrows to Burst Balloons', 'Medium', 'Intervals'],

  // ---- Math & Geometry (3) ----
  ['rotate-image', 'Rotate Image', 'Medium', 'Math & Geometry'],
  ['spiral-matrix', 'Spiral Matrix', 'Medium', 'Math & Geometry'],
  ['powx-n', 'Pow(x, n)', 'Medium', 'Math & Geometry'],

  // ---- Bit Manipulation (2) ----
  ['single-number', 'Single Number', 'Easy', 'Bit Manipulation'],
  ['number-of-1-bits', 'Number of 1 Bits', 'Easy', 'Bit Manipulation'],
]

export function buildSeedProblems() {
  const solved = new Set(SOLVED_SLUGS)
  const out = {}
  for (const [slug, title, difficulty, topic] of POOL) {
    out[slug] = { slug, title, difficulty, topic, status: solved.has(slug) ? 'revise' : 'new' }
  }
  return out
}

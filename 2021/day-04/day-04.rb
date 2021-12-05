require 'hash_dot'
Hash.use_dot_syntax = true

input = File.read("#{File.dirname(__FILE__)}/input.txt")
test_input = "7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1

22 13 17 11  0
 8  2 23  4 24
21  9 14 16  7
 6 10  3 18  5
 1 12 20 15 19

 3 15  0  2 22
 9 18 13 17  5
19  8  7 25 23
20 11 10 24  4
14 21 16 12  6

14 21 17 24  4
10 16 15  9 19
18  8 23 26 20
22 11 13  6  5
 2  0 12  3  7"

# --- Part One ---

def get_numbers(lines)
  lines[0].split(',').map(&:to_i)
end

def get_boards(lines)
  boards = []
  current_board = nil
  current_row = nil

  (lines[1..-1] + ['']).map(&:strip).each do |line|
    if line.empty?
      boards << current_board if current_board&.vals&.any?
      current_board = {
        vals: {},
        drawn_vals: {},
        completed: false,
        rows: Array.new(5) { 0 },
        cols: Array.new(5) { 0 },
      }
      current_row = 0
      next
    end

    line.split(' ').map(&:to_i).each_with_index do |n, i|
      current_board.vals[n] ||= []
      current_board.vals[n] << [current_row, i]
    end
    current_row += 1
  end

  boards
end

def fill_value(boards, n)
  boards.each do |board|
    next unless board.vals.key?(n)

    board.vals[n].each do |row, col|
      board.rows[row] += 1
      board.cols[col] += 1
      board.completed = true if board.rows[row] == 5 || board.cols[col] == 5
    end
    board.drawn_vals[n] = board.vals[n]
    board.vals.delete(n)
  end
end

def ex1(input)
  lines = input.lines
  boards = get_boards(lines)

  get_numbers(lines).each do |n|
    fill_value(boards, n)

    board = boards.select { |b| b.completed }.first
    next unless board

    sum = board.vals.reduce(0) { |acc, entry|
      k,v = entry
      acc + (k * v.length)
    }
    return sum * n
  end
end

puts(ex1(test_input))
puts(ex1(input))

# --- Part Two ---

def ex2(input)
  lines = input.lines
  numbers = get_numbers(lines)
  boards = get_boards(lines)
  last_board = nil

  while boards.length > 0
    n = numbers.shift
    fill_value(boards, n)
    boards.delete_if { |b|
      if b.completed
        last_board = b
        true
      end
    }
  end

  sum = last_board.vals.reduce(0) { |acc, entry|
    k,v = entry
    acc + (k * v.length)
  }
  return sum * n
end

puts(ex2(test_input))
puts(ex2(input))

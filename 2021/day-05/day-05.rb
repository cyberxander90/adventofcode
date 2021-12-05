require 'hash_dot'
Hash.use_dot_syntax = true

input = File.read("#{File.dirname(__FILE__)}/input.txt")
test_input =
"0,9 -> 5,9
8,0 -> 0,8
9,4 -> 3,4
2,2 -> 2,1
7,0 -> 7,4
6,4 -> 2,0
0,9 -> 2,9
3,4 -> 1,4
0,0 -> 8,8
5,5 -> 8,2"

# --- Part One ---

def parse_points(input)
  input.lines.each { |line|
    yield line.strip.match(/(\d+),(\d+) -> (\d+),(\d+)/)[1..-1].map(&:to_i)
  }
end

def points_in_line(x1, y1, x2, y2, invert = false, &b)
  return if x1 != x2 && y1 != y2
  return points_in_line(y1, x1, y2, x2, invert = true, &b) if x1 != x2

  min, max = [y1, y2].minmax
  (min..max).each { |i| yield(invert ? [i, x1] : [x1, i]) }
end

def ex1(input)
  board = Hash.new(0)
  parse_points(input) { |points|
    points_in_line(*points) { |x,y| board[:"#{x},#{y}"] += 1 }
  }
  board.values.count { |v| v >= 2 }
end

puts(ex1(test_input))
puts(ex1(input))

# --- Part Two ---

def points_in_line_with_diagonal(x1, y1, x2, y2, &b)
  return points_in_line(x1,y1, x2, y2, &b) if x1 == x2 || y1 == y2
  return if (x1-x2).abs != (y1-y2).abs

  x1, y1, x2, y2 = x2, y2, x1, y1 if x1 > x2  # swap
  m = y1 < y2 ? 1 : -1
  (x1..x2).each_with_index { |x, i|
    yield [x, y1 + (i * m)]
  }
end

def ex2(input)
  board = Hash.new(0)
  parse_points(input) { |points|
    points_in_line_with_diagonal(*points) { |x,y| board[:"#{x},#{y}"] += 1 }
  }
  board.values.count { |v| v >= 2 }
end

puts(ex2(test_input))
puts(ex2(input))

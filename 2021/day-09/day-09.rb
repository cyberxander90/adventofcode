
input = File.read("#{File.dirname(__FILE__)}/input.txt")
test_input =
"2199943210
3987894921
9856789892
8767896789
9899965678"

# --- Part One ---

def parse(input)
  input.lines.map do |line|
    line.strip.split('').map(&:to_i)
  end
end

def at(m)
  -> (i, j) { i < 0 || i >= m.length || j < 0 || j >= m[0].length ? 10 : m[i][j] }
end

def ex1(m)
  r = 0
  v = at(m)

  (0...m.length).each do |i|
    (0...m[0].length).each do |j|
      n = m[i][j]
      if n < v.(i, j+1) && n < v.(i, j-1) && n < v.(i+1, j) && n < v.(i-1, j)
        r += (n+1)
      end
    end
  end

  r
end

puts ex1(parse(test_input))
puts ex1(parse(input))

# --- Part Two ---

def adj(i,j)
  [[i, j+1], [i, j-1], [i+1, j], [i-1, j]]
end

def basins(m, i, j)
  queue, visited = [], []
  enqueue = -> (i,j) do
    queue << [i,j]
    visited << [i,j]
  end
  v = at(m)

  enqueue.(i,j)
  while queue.length > 0
    i,j = queue.shift

    adj(i,j).each do |i2,j2|
      enqueue.(i2,j2) if v.(i2,j2) < 9 && !visited.include?([i2,j2]) && v.(i2,j2) > v.(i,j)
    end
  end

  visited.length
end

def ex2(m)
  v = at(m)

  (0...m.length).map do |i|
    (0...m[0].length).map do |j|
      adj(i,j).all? { |i2,j2| v.(i,j) < v.(i2,j2) } ? basins(m, i, j) : nil
    end
  end.flatten.compact.sort[-3..-1].reduce(1) { |acc, i| acc*i }
end

puts ex2(parse(test_input))
puts ex2(parse(input))

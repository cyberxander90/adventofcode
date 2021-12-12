input = File.read("#{File.dirname(__FILE__)}/input.txt")
test_input =
"5483143223
2745854711
5264556173
6141336146
6357385478
4167524645
2176841721
6882881134
4846848554
5283751526"

# --- Part One ---

def parse(input)
  input.strip.lines.map { |l| l.strip.split('').map(&:to_i) }
end

def adj(m, i, j)
  [[i, j+1], [i, j-1], [i+1, j], [i+1, j+1], [i+1, j-1], [i-1, j], [i-1, j+1], [i-1, j-1]]
    .map { |i,j| i >= 0 && j >= 0 && i < m.length && j < m[0].length && [i,j] }
    .select{ |v| v }
end

def ex1(m)
  result = 0

  (1..100).each do
    tens = []

    (0...m.length).each do |i|
      (0...m[0].length).each do |j|
        tens << [i,j] if (m[i][j] += 1) == 10
      end
    end

    while tens.length > 0
      result += 1
      i,j = tens.shift
      m[i][j] = 0

      adj(m, i, j).each do |i2, j2|
        v = m[i2][j2]
        next if v == 0 || v == 10
        tens << [i2,j2] if (m[i2][j2] += 1) == 10
      end
    end
  end

  result
end

puts ex1(parse(test_input))
puts ex1(parse(input))

# --- Part Two ---

def ex2(m)
  iteration = 0
  total = m.length * m[0].length

  while true
    iteration += 1
    tens_total = 0
    tens = []
    add_ten = -> (i,j) do
      tens << [i,j]
      tens_total += 1
    end

    (0...m.length).each do |i|
      (0...m[0].length).each do |j|
        add_ten.(i, j) if (m[i][j] += 1) == 10
      end
    end

    while tens.length > 0
      i,j = tens.shift
      m[i][j] = 0

      adj(m, i, j).each do |i2, j2|
        v = m[i2][j2]
        next if v == 0 || v == 10
        add_ten.(i2, j2) if (m[i2][j2] += 1) == 10
      end
    end

    return iteration if tens_total == total
  end
end

puts ex2(parse(test_input))
puts ex2(parse(input))

require 'hash_dot'
Hash.use_dot_syntax = true

input = File.read("#{File.dirname(__FILE__)}/input.txt")
test_input = "16,1,2,0,4,2,7,1,2,14"

# --- Part One ---

def numbers(input)
  input.split(',').map(&:to_i)
end

def ex1(vals)
  vals.map { |v1| vals.map { |v2| (v1-v2).abs }.sum }.min
end

puts(ex1(numbers(test_input)))
puts(ex1(numbers(input)))

# --- Part Two ---

def ex2_force(vals)
  min, max = vals.minmax
  cost = -> (v1, v2) do
    n = (v1 - v2).abs
    (n * (n+1)) / 2
  end

  (min...max).map { |v1| vals.map { |v2| cost.call(v1, v2) }.sum }.min
end

puts ex2_force(numbers(test_input))
puts ex2_force(numbers(input))

def ex2(vals)
  m = (vals.sum / vals.length.to_f)
  cost = -> (v1, v2) do
    n = (v1 - v2).abs
    (n * (n+1)) / 2
  end

  medias = [m.ceil(0), m.truncate(0)].uniq
  medias.map { |v1| vals.map { |v2| cost.call(v1, v2) }.sum }.min
end

puts ex2(numbers(test_input))
puts ex2(numbers(input))

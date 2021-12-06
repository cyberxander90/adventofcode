require 'hash_dot'
Hash.use_dot_syntax = true

input = File.read("#{File.dirname(__FILE__)}/input.txt")
test_input = "3,4,3,1,2"

# --- Part One ---

def parse_ages(input)
  input.split(',').map(&:to_i)
end

def ex1(input, days = 80)
  ages = parse_ages(input)

  (1..days).each do
    n = 0
    (0...ages.length).each do |i|
      ages[i] -= 1

      if ages[i] < 0
        ages[i] = 6
        n += 1
      end
    end

    ages += Array.new(n) { 8 }
  end

  ages.length
end

puts(ex1(test_input))
puts(ex1(input))

# --- Part Two ---

def calc(stage, remainder_days, memo)
  key = :"#{stage}_#{remainder_days}"
  return memo[key] if memo.key? key

  result = 1
  while remainder_days > 0
    remainder_days -= 1
    stage -= 1

    if stage == -1
      stage = 6
      result += calc(8, remainder_days, memo)
    end
  end

  memo[key] = result
end

def ex2(input, days)
  memo = {}
  parse_ages(input).map do |age|
    calc(age, days, memo)
  end.sum
end

puts(ex2(test_input, 256))
puts(ex2(input, 256))

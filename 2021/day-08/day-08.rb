require 'hash_dot'
require 'active_support/core_ext/hash'
Hash.use_dot_syntax = true

input = File.read("#{File.dirname(__FILE__)}/input.txt")
test_input =
"be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe
edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc
fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg
fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb
aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea
fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb
dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe
bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef
egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb
gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce"

# --- Part One ---

def parse_codes(input)
  input.lines.map do |line|
    inp, outp = line.split('|').map { |codes| codes.strip.split(' ') }
    { inp: inp, outp: outp }
  end
end

def ex1(codes)
  uniq_codes = -> (code) { [2, 4, 3, 7].include?(code.length) }
  codes.reduce(0) { |acc, inp:, outp:| acc + outp.count(&uniq_codes) }
end

# puts ex1(parse_codes(test_input))
# puts ex1(parse_codes(input))

# --- Part Two ---

#   0000
#  5    1
#  5    1
#   6666
#  4    2
#  4    2
#   3333

CONFIG = {
  0 => [0, 1, 2, 3, 4, 5],
  1 => [1, 2],
  2 => [0, 1, 3, 4, 6],
  3 => [0, 1, 2, 3, 6],
  4 => [1, 2, 5, 6],
  5 => [0, 2, 3, 5, 6],
  6 => [0, 2, 3, 4, 5, 6],
  7 => [0, 1, 2],
  8 => [0, 1, 2, 3, 4, 5, 6],
  9 => [0, 1, 2, 3, 5, 6]
}

def combinations(code)
  yield code and return if (len = code.length) <= 1

  (0...len).each do |i|
    rem_code = code[0...i] + code[i+1...len]
    combinations(rem_code) { |comb| yield [code[i]] + comb }
  end
end

def deep_dup(h)
  Marshal.load(Marshal.dump(h))
end

def unwire(codes, config_map = nil, config = nil)
  config_map ||= deep_dup(CONFIG)
  config ||= Hash[('a'..'g').map { |k| [k, nil] }]

  return config if codes.empty?

  config_map.each do |digit, pos|
    positions = pos.clone
    code = codes.first.split('')

    next if code.length != positions.length
    next if code.any? { |c| config[c] && !positions.include?(config[c]) }

    code.delete_if { |l| positions.delete(config[l]) }

    combinations(code) do |comb|
      config_dup = deep_dup(config)
      (0...positions.length).each { |i| config[comb[i]] = positions[i] }

      result = unwire(codes[1..-1], config_map.except(digit), config)
      return result if result

      config = config_dup
    end
  end

  nil
end

def ex2(all_codes)
  all_codes.sum do |inp:, outp:|
    conf = unwire(inp.sort_by { |code| code.length })
    outp.map do |code|
      code_pos = code.split('').map { |c| conf[c] }.sort
      CONFIG.find { |_, positions| positions == code_pos }.first.to_s
    end.join.to_i
  end
end

puts ex2(parse_codes(test_input))
puts ex2(parse_codes(input))

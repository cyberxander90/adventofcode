input = File.read("#{File.dirname(__FILE__)}/input.txt")
test_input =
"NNCB

CH -> B
HH -> N
CB -> H
NH -> C
HB -> C
HC -> B
HN -> C
NN -> C
BH -> H
NC -> B
NB -> B
BN -> B
BB -> N
BC -> B
CC -> N
CN -> C"

# --- Part One ---

def parse(input)
  lines = input.strip.lines.map { |l| l.strip }
  tpl = lines[0].split('')
  ins = lines[2..-1].map { |l| l.split(' -> ') }.to_h
  [tpl, ins]
end

def ex1(input, to = 10)
  tpl, ins = parse(input)

  (1..to).each do
    new_tpl = []
    (tpl+['']).each_cons(2) do |a, b|
      new_tpl += [a, ins[a+b]]
    end
    tpl = new_tpl.compact
  end

  vals = tpl.tally.to_a.sort_by { |a,b| b }
  vals[-1][1] - vals[0][1]
end

puts ex1(test_input)
puts ex1(input)

# --- Part Two ---

def ex2(input)
  tpl, ins = parse(input)

  total = Hash.new(0).tap {|h| tpl.each {|i| h[i] += 1 } }
  pairs = Hash.new(0).tap {|h| tpl.each_cons(2) {|a,b| h[a+b] += 1 } }

  (1..40).each do
    new_pairs = Hash.new(0)
    pairs.each do |k,v|
      a,b = k.split('')
      c = ins[a+b]
      if c
        new_pairs[a+c] += v
        new_pairs[c+b] += v
        total[c] += v
      else
        new_pairs[a+b] += v
      end
    end
    pairs = new_pairs
  end

  vals = total.to_a.sort_by { |a,b| b }
  vals[-1][1] - vals[0][1]
end

puts ex2(test_input)
puts ex2(input)

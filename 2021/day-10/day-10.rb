input = File.read("#{File.dirname(__FILE__)}/input.txt")
test_input =
"[({(<(())[]>[[{[]{<()<>>
[(()[<>])]({[<{<<[]>>(
{([(<{}[<>[]}>{[]{[(<()>
(((({<>}<{<{<>}{[]{[]{}
[[<[([]))<([[{}[[()]]]
[{[{({}]{}}([{[{{{}}([]
{<[[]]>}<{[{[{[]{()[[[]
[<(<(<(<{}))><([]([]()
<{([([[(<>()){}]>(<<{{
<{([{{}}[<[[[<>{}]]]>[]]"

# --- Part One ---

POINTS = {
  ')' => 3,
  ']' => 57,
  '}' => 1197,
  '>' => 25137,
}

INVERSE = {
  ')' => '(',
  ']' => '[',
  '}' => '{',
  '>' => '<',
}

OPEN = ['(', '[', '{', '<']

def ex1(input)
  input.lines.sum do |chunks|
    stack = []
    illegal = chunks.split('').find do |c|
      stack << c and next if OPEN.include?(c)
      break c if stack.pop != INVERSE[c]
    end
    POINTS[illegal] || 0
  end
end

# puts ex1(test_input)
# puts ex1(input)

# --- Part Two ---

POINTS2 = {
  ')' => 1,
  ']' => 2,
  '}' => 3,
  '>' => 4,
}

INVERSE2 = INVERSE.invert

def ex2(input)
  v = input.lines.map do |chunks|
    stack = []
    illegal = chunks.strip.split('').find do |c|
      stack << c and next if OPEN.include?(c)
      break c if stack.pop != INVERSE[c]
    end
    next if illegal

    stack.reverse.reduce(0) { |acc, c| acc*5 + POINTS2[INVERSE2[c]] }
  end.compact.sort
  v[v.length / 2]
end

puts ex2(test_input)
puts ex2(input)

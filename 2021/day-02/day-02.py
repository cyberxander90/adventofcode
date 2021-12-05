import os

test_input = [
	'forward 5',
	'down 5',
	'forward 8',
	'up 3',
	'down 8',
	'forward 2',
]
input = open(os.path.join(os.path.dirname(__file__), './input.txt'), 'r').readlines()

def parse_input(input):
	return [line.strip().split(' ') for line in input]

# --- Part One ---

def ex1(input):
	x, y = 0, 0
	for op, value in parse_input(input):
		val = int(value)
		if op == 'forward':
			x += val
		if op == 'down':
			y += val
		if op == 'up':
			y -= val
	return x*y

print(ex1(test_input))
print(ex1(input))

# --- Part Two ---

def ex2(input):
	x, y, aim = 0, 0, 0
	for op, value in parse_input(input):
		val = int(value)
		if op == 'forward':
			x += val
			y += (aim * val)

		if op == 'down':
			aim += val

		if op == 'up':
			aim -= val
	return x*y

print(ex2(test_input))
print(ex2(input))

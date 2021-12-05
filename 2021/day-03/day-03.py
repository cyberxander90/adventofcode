import os

test_input = [
    '00100',
    '11110',
    '10110',
    '10111',
    '10101',
    '01111',
    '00111',
    '11100',
    '10000',
    '11001',
    '00010',
    '01010'
]
input = open(os.path.join(os.path.dirname(__file__), './input.txt'), 'r').readlines()
input = [line.strip() for line in input]

# --- Part One ---

def binary_to_decimal(binary):
	result = 0
	for i in range(len(binary)):
		if binary[i] == 1 or binary[i] == '1':
			result += pow(2, len(binary) - i - 1)
	return result

def ex1(input):
	gamma, eps = ([], [])
	l = len(input[0])

	for i in range(l):
		count = 0
		for j in range(len(input)):
			count += 1 if input[j][i] == '1' else -1

		gamma.append(1 if count > 0 else 0)
		eps.append(1 if count < 0 else 0)

	return binary_to_decimal(gamma) * binary_to_decimal(eps)


# print(ex1(test_input))
# print(ex1(input))

# --- Part Two ---

def find_common_bit(input, i):
	count = 0
	for j in range(len(input)):
		count += 1 if input[j][i] == '1' else -1
	return count

def find_rate(input, rate):
	i = 0
	while len(input) > 1:
		common_bit = find_common_bit(input, i)

		j = 0
		while j < len(input):
			bit = input[j][i]
			if common_bit >= 0 and ((rate == 1 and bit == '0') or (rate == 0 and bit == '1')):
				del input[j]
			elif common_bit < 0 and ((rate == 1 and bit == '1') or (rate == 0 and bit == '0')):
				del input[j]
			else:
				j+=1

		i += 1
	return input[0]

def ex2(input):
	rate1 = find_rate(input[:], 1)
	rate2 = find_rate(input[:], 0)
	return binary_to_decimal(rate1) * binary_to_decimal(rate2)

print(ex2(test_input))
print(ex2(input))
# 6822109

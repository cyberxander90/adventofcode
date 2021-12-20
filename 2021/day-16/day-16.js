const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.join(__dirname, './input.txt'), 'utf8');

//--- Part One ---

function decimalToBinary(decimal) {
  return decimal == 0 || decimal == 1
    ? [decimal]
    : [...decimalToBinary(Math.floor(decimal / 2)), decimal % 2];
}

function binaryToDecimal(binary) {
  return binary.length == 1
    ? binary[0]
    : binary[0] * (2 ** (binary.length - 1)) + binaryToDecimal(binary.slice(1))
}

function hexToBinary(hex) {
  const letters = 'ABCDEF';
  return hex.split('')
    .map(l => {
      const index = letters.indexOf(l);
      const binary = decimalToBinary(index == -1 ? parseInt(l) : 10 + index);

      return [0, 0, 0, ...binary].slice(-4);
    })
    .flat();
}

function decodePackets(binary, currentIndex = 0) {
  const packet = {
    version: binaryToDecimal(binary.slice(currentIndex, currentIndex+3)),
    type: binaryToDecimal(binary.slice(currentIndex+3, currentIndex+6)),
  };
  currentIndex += 6;

  if (packet.type == 4) {
    let isLastGroup = false;
    const binaryGroups = [];

    while (!isLastGroup) {
      binaryGroups.push(binary.slice(currentIndex + 1, currentIndex + 5));
      isLastGroup = binary[currentIndex] == 0;
      currentIndex += 5;
    }
    packet.value = binaryToDecimal(binaryGroups.flat())
  } else {
    packet.subPackets = [];

    if (binary[currentIndex] == 0) {
      const total = binaryToDecimal(binary.slice(currentIndex+1, currentIndex+16));
      currentIndex += 16;
      const goToIndex = currentIndex + total;

      while (currentIndex < goToIndex) {
        const [subPacket, nextIndex] = decodePackets(binary, currentIndex);
        packet.subPackets.push(subPacket);
        currentIndex = nextIndex;
      }
    } else {
      let amountOfSubPackets = binaryToDecimal(binary.slice(currentIndex+1, currentIndex+12));
      currentIndex += 12;

      while(amountOfSubPackets > 0) {
        const [subPacket, nextIndex] = decodePackets(binary, currentIndex);
        packet.subPackets.push(subPacket);
        currentIndex = nextIndex;
        amountOfSubPackets -= 1;
      }
    }
  }

  return [packet, currentIndex];
}

function sumPacketVersions(packet) {
  return (packet.subPackets || []).reduce((acc, subPacket) => acc + sumPacketVersions(subPacket), packet.version);
}

function ex1(input) {
  return sumPacketVersions(decodePackets(hexToBinary(input.trim()))[0]);
}

console.log(ex1('8A004A801A8002F478'));
console.log(ex1('620080001611562C8802118E34'));
console.log(ex1('C0015000016115A2E0802F182340'));
console.log(ex1('A0016C880162017C3686B18A3D4780'));
console.log(ex1(input));

// --- Part Two ---

function packetValue(packet) {
  return {
    0: () => packet.subPackets.reduce((acc, subPacket) => acc + packetValue(subPacket), 0),
    1: () => packet.subPackets.reduce((acc, subPacket) => acc * packetValue(subPacket), 1),
    2: () => packet.subPackets.reduce((min, subPacket) => Math.min(min, packetValue(subPacket)), Number.MAX_SAFE_INTEGER),
    3: () => packet.subPackets.reduce((max, subPacket) => Math.max(max, packetValue(subPacket)), -1),
    4: () => packet.value,
    5: () => packetValue(packet.subPackets[0]) > packetValue(packet.subPackets[1]) ? 1 : 0,
    6: () => packetValue(packet.subPackets[0]) < packetValue(packet.subPackets[1]) ? 1 : 0,
    7: () => packetValue(packet.subPackets[0]) == packetValue(packet.subPackets[1]) ? 1 : 0,
  }[packet.type]();
}

function ex2(input) {
  return packetValue(decodePackets(hexToBinary(input.trim()))[0]);
}

console.log(ex2('C200B40A82'));
console.log(ex2('04005AC33890'));
console.log(ex2('880086C3E88112'));
console.log(ex2('CE00C43D881120'));
console.log(ex2('D8005AC2A8F0'));
console.log(ex2('F600BC2D8F'));
console.log(ex2('9C005AC2F8F0'));
console.log(ex2('9C0141080250320F1802104A08'));
console.log(ex2(input));

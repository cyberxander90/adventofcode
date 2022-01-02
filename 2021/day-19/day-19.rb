require 'set'

input = File.read("#{File.dirname(__FILE__)}/input.txt")
test_input =
"--- scanner 0 ---
404,-588,-901
528,-643,409
-838,591,734
390,-675,-793
-537,-823,-458
-485,-357,347
-345,-311,381
-661,-816,-575
-876,649,763
-618,-824,-621
553,345,-567
474,580,667
-447,-329,318
-584,868,-557
544,-627,-890
564,392,-477
455,729,728
-892,524,684
-689,845,-530
423,-701,434
7,-33,-71
630,319,-379
443,580,662
-789,900,-551
459,-707,401

--- scanner 1 ---
686,422,578
605,423,415
515,917,-361
-336,658,858
95,138,22
-476,619,847
-340,-569,-846
567,-361,727
-460,603,-452
669,-402,600
729,430,532
-500,-761,534
-322,571,750
-466,-666,-811
-429,-592,574
-355,545,-477
703,-491,-529
-328,-685,520
413,935,-424
-391,539,-444
586,-435,557
-364,-763,-893
807,-499,-711
755,-354,-619
553,889,-390

--- scanner 2 ---
649,640,665
682,-795,504
-784,533,-524
-644,584,-595
-588,-843,648
-30,6,44
-674,560,763
500,723,-460
609,671,-379
-555,-800,653
-675,-892,-343
697,-426,-610
578,704,681
493,664,-388
-671,-858,530
-667,343,800
571,-461,-707
-138,-166,112
-889,563,-600
646,-828,498
640,759,510
-630,509,768
-681,-892,-333
673,-379,-804
-742,-814,-386
577,-820,562

--- scanner 3 ---
-589,542,597
605,-692,669
-500,565,-823
-660,373,557
-458,-679,-417
-488,449,543
-626,468,-788
338,-750,-386
528,-832,-391
562,-778,733
-938,-730,414
543,643,-506
-524,371,-870
407,773,750
-104,29,83
378,-903,-323
-778,-728,485
426,699,580
-438,-605,-362
-469,-447,-387
509,732,623
647,635,-688
-868,-804,481
614,-800,639
595,780,-596

--- scanner 4 ---
727,592,562
-293,-554,779
441,611,-461
-714,465,-776
-743,427,-804
-660,-479,-426
832,-632,460
927,-485,-438
408,393,-506
466,436,-512
110,16,151
-258,-428,682
-393,719,612
-211,-452,876
808,-476,-593
-575,615,604
-485,667,467
-680,325,-822
-627,-443,-432
872,-547,-609
833,512,582
807,604,487
839,-516,451
891,-625,532
-652,-548,-490
30,-46,-14"

# --- Part One ---

def parse(input)
  scanners = []

  input.strip.lines.map(&:strip).each do |line|
    next if line.empty?
    scanners << [] and next if line.start_with? '---'
    scanners.last << line.split(',').map(&:to_i)
  end

  scanners
end

def map_of_scanners(scanners)
  map = { 0 => {} }
  centers = { 0 => [0,0,0] }
  queue = [0]
  visited = Array.new(scanners.length) {false}

  while queue.length > 0
    index = queue.shift
    visited[index] = true
    # puts "Remaining scanners: #{visited.count { |v| !v } }"

    (0...scanners.length).map do |i|
      next if visited[i]

      Thread.new do
        # puts "Checking scanner #{index} with #{i}"
        if overlaps = overlaps(scanners[index], scanners[i])
          # puts "Founded #{index} with #{i}"
          queue << i
          scanners[i] = overlaps[:scanner_b]
          map[index] ||= {}
          map[index][i] = overlaps
          centers[i] = (0..2).map { |c| centers[index][c] + overlaps[:center][c] }
        end
      end
    end.compact.each { |t| t.join }
  end

  return { map: map, centers: centers }
end

L1 = [
  -> ((x,y,z)) { [x,y,z] },
  -> ((x,y,z)) { [x,z,y] },
  -> ((x,y,z)) { [y,x,z] },
  -> ((x,y,z)) { [y,z,x] },
  -> ((x,y,z)) { [z,x,y] },
  -> ((x,y,z)) { [z,y,x] },
]
L2 = [
  -> ((x,y,z)) { [x, y, z] },
  -> ((x,y,z)) { [x*-1, y, z] },
  -> ((x,y,z)) { [x, y*-1, z] },
  -> ((x,y,z)) { [x, y, z*-1] },
  -> ((x,y,z)) { [x*-1, y*-1, z] },
  -> ((x,y,z)) { [x*-1, y, z*-1] },
  -> ((x,y,z)) { [x, y*-1, z*-1] },
  -> ((x,y,z)) { [x*-1, y*-1, z*-1] },
]

def overlaps(scanner_a, scanner_b)
  initial_scanner_b = scanner_b;

  L1.each do |fn1|
    L2.each do |fn2|
      scanner_b = initial_scanner_b.map { |point| fn2.(fn1.(point)) }
      result = scans_overlaps(scanner_a, scanner_b)
      return result if result
    end
  end
  nil
end

def scans_overlaps(scanner_a, scanner_b)
  (0...scanner_a.length).each_with_index do |i, index1|
    return nil if scanner_a.length - index1 < 12

    (0...scanner_b.length).each_with_index do |j, index2|
      break nil if (scanner_b.length - index2) < 12

      overlaps = 0
      center = (0..2).map { |c| scanner_a[i][c] - scanner_b[j][c] }
      next if (0..2).any? { |c| center[c].abs > 2000 }

      scanner_b.each_with_index do |point_b, index|
        if (scanner_b.length - index) < 12 - overlaps
          break
        end

        point_b_in_a = (0..2).map { |c| center[c] + point_b[c] }
        next if (0..2).any? { |c| point_b_in_a[c].abs > 1000 }

        scanner_a.each do |point_a|
          if point_a == point_b_in_a
            overlaps += 1
            break
          end
        end

        if overlaps >= 12
          return { center: center, scanner_b: scanner_b }
        end
      end
    end
  end

  nil
end

def ex1(input)
  scanners = parse(input)
  map = map_of_scanners(scanners)

  points_relative_to_a = Set.new
  (0...scanners.length).each do |i|
    (0...scanners[i].length).each do |j|
      points_relative_to_a << (0..2).map { |c| map[:centers][i][c] + scanners[i][j][c] }
    end
  end

  puts points_relative_to_a.length
  map
end

m1 = ex1(test_input) # 79
m2 = ex1(input)      # 432

# --- Part Two ---

def ex2(m)
  dist = 0
  (0...m[:centers].length - 1).each do |i|
    (i...m[:centers].length).each do |j|
      current_dist = (0..2).map { |c| (m[:centers][i][c] - m[:centers][j][c]).abs }.sum
      dist = [dist, current_dist].max
    end
  end
  dist
end

puts ex2(m1)  # 3621
puts ex2(m2)  # 14414

import { randomNumGenerator } from "@/app/lib/utils/randomNumGenerator"


describe('generates random number', () => {
  test('when passed 4 function generates number between 1 and 4', () => {
    const actual = randomNumGenerator(4);
    expect(actual).not.toBe(0);
    expect(actual).toBeGreaterThan(0)
    expect(actual).toBeLessThan(5);
  })
  test('when passed 9 function generates number between 1 and 9', () => {
    const actual = randomNumGenerator(9);
    expect(actual).not.toBe(0);
    expect(actual).toBeGreaterThan(0)
    expect(actual).toBeLessThan(10);
  })
  test('when passed 12 function generates number between 1 and 12', () => {
    const actual = randomNumGenerator(12);
    expect(actual).not.toBe(0);
    expect(actual).toBeGreaterThan(0)
    expect(actual).toBeLessThan(13);
  })
})
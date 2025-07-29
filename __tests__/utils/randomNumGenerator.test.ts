import { randomNumGenerator } from "@/app/lib/utils/randomNumGenerator"


describe('generates random number', () => {
  test('function generates number between 1 and 4', () => {
    const actual = randomNumGenerator();
    expect(actual).not.toBe(0);
    expect(actual).toBeGreaterThan(0)
    expect(actual).toBeLessThan(5);
  })
})
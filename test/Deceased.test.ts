import {deceased} from "../src";

const dec = deceased({gender: true});

describe("deceased test", () => {
  it("should default estate", () => {
    expect(dec.estate).toBe(100);
  });
  it("should change estate", () => {
    expect(() => (dec.estate = 1000)).not.toThrowError();
  });
  it("should estate changed", () => {
    expect(dec.estate).toBe(1000);
  });
  it("should check gender", () => {
    expect(dec.gender).toBe(true);
  });
});

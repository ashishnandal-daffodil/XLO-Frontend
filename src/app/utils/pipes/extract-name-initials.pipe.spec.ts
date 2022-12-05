import { extractNameInitialsPipe } from "./extract-name-initials.pipe";

describe("extractNameInitialsPipe", () => {
  it("create an instance", () => {
    const pipe = new extractNameInitialsPipe();
    expect(pipe).toBeTruthy();
  });
});

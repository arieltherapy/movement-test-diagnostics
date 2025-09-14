
export interface MovementTest {
  id: number;
  name: string;
  description: string;
  rangeNote: string;
  oppositeAction: string;
}

export interface TestState {
  id: number;
  left: boolean;
  right: boolean;
  notes: string;
}

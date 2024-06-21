import { COWCProp } from './COWCProp';

export class COWCState<EX> extends COWCProp<EX> {
  active = 0;
  use(amm = 1) {
    return this.active += amm;
  }
  unuse(amm = 1) {
    return this.use(-amm);
  }
}

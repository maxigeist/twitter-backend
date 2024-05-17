import { mockReset } from 'jest-mock-extended'
import PrismaMock from '../test/config'

beforeEach(async () => {
  const prismaMockInstance = new PrismaMock()
  mockReset(prismaMockInstance.prismaMock)
})

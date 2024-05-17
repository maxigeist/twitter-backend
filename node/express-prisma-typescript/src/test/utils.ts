import { mockReset } from 'jest-mock-extended'
import { getPrismaMock } from '../test/config'

beforeEach(async () => {
  mockReset(await getPrismaMock())
})

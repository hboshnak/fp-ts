import * as assert from 'assert'
import { pipe } from '../src/function'
import * as N from '../src/number'
import * as _ from '../src/Semigroup'
import { deepStrictEqual } from './util'
import * as B from '../src/boolean'
import * as S from '../src/string'

describe('Semigroup', () => {
  it('getTupleSemigroup', () => {
    const S1 = _.getTupleSemigroup(S.Semigroup, N.SemigroupSum)
    deepStrictEqual(pipe(['a', 1], S1.concat(['b', 2])), ['ab', 3])
    const S2 = _.getTupleSemigroup(S.Semigroup, N.SemigroupSum, B.SemigroupAll)
    deepStrictEqual(pipe(['a', 1, true], S2.concat(['b', 2, false])), ['ab', 3, false])
  })

  it('fold', () => {
    deepStrictEqual(_.fold(S.Monoid)('')(['a', 'b', 'c']), 'abc')
  })

  it('getMeetSemigroup', () => {
    const S = _.getMeetSemigroup(N.Ord)
    deepStrictEqual(pipe(1, S.concat(2)), 1)
  })

  it('getJoinSemigroup', () => {
    const S = _.getJoinSemigroup(N.Ord)
    deepStrictEqual(pipe(1, S.concat(2)), 2)
  })

  it('getObjectSemigroup', () => {
    type T = {
      readonly foo?: number
      readonly bar: string
    }
    const foo: T = {
      foo: 123,
      bar: '456'
    }
    const bar: T = {
      bar: '123'
    }
    const S = _.getObjectSemigroup<T>()
    const result = pipe(foo, S.concat(bar))
    const expected = Object.assign({}, foo, bar)
    deepStrictEqual(result.foo, expected.foo)
    deepStrictEqual(result.bar, expected.bar)
  })

  it('getFirstSemigroup', () => {
    const S = _.getFirstSemigroup<number>()
    deepStrictEqual(pipe(1, S.concat(2)), 1)
  })

  it('getDual', () => {
    const DS = _.getDual(S.Semigroup)
    deepStrictEqual(pipe('a', DS.concat('b')), 'ba')
  })

  it('getIntercalateSemigroup', () => {
    const IS = _.getIntercalateSemigroup(' ')(S.Semigroup)
    assert.strictEqual(pipe('a', IS.concat('b')), 'a b')
    assert.strictEqual(pipe('a', IS.concat('b'), IS.concat('c')), 'a b c')
  })

  it('getConstantSemigroup', () => {
    const S = _.getConstantSemigroup('a')
    assert.strictEqual(S.concat('b')('c'), 'a')
  })
})

/**
 * Unit tests for the action's main functionality, src/main.ts
 *
 * These should be run as if the action was called from a workflow.
 * Specifically, the inputs listed in `action.yml` should be set as environment
 * variables following the pattern `INPUT_<INPUT_NAME>`.
 */

import * as core from '@actions/core'
import * as github from '@actions/github'
import { run } from '../src/main'

jest.mock('@actions/core')
jest.mock('@actions/github')
// jest.mock('@conventional-commits/parser');

describe('run action', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should fail when event is not pull_request', async () => {
    github.context.eventName = 'push'

    await run()

    expect(core.setFailed).toHaveBeenCalledWith(
      "Invalid event: push. This action can only be used on 'pull_request'"
    )
  })

  test('should process a valid pull request title', async () => {
    github.context.eventName = 'pull_request'
    github.context.payload = {
      pull_request: {
        title: 'feat: add new feature',
        number: 1
      }
    }
    ;(core.getBooleanInput as jest.Mock).mockReturnValue(false)

    await run()

    expect(core.setOutput).toHaveBeenCalledWith('valid', 'true')
    expect(core.setOutput).toHaveBeenCalledWith(
      'title',
      'feat: add new feature'
    )
    expect(core.setOutput).toHaveBeenCalledWith('type', 'feat')
    expect(core.setOutput).toHaveBeenCalledWith('scope', '')
    expect(core.setOutput).toHaveBeenCalledWith('subject', 'add new feature')
    expect(core.setOutput).toHaveBeenCalledWith('breaking_change', 'false')
  })

  test('should process a valid pull request title with a scope and breaking change', async () => {
    github.context.eventName = 'pull_request'
    github.context.payload = {
      pull_request: {
        title: 'fix(main)!: undo the confrigulators',
        number: 1
      }
    }
    ;(core.getBooleanInput as jest.Mock).mockReturnValue(false)

    await run()

    expect(core.setOutput).toHaveBeenCalledWith('valid', 'true')
    expect(core.setOutput).toHaveBeenCalledWith(
      'title',
      'fix(main)!: undo the confrigulators'
    )
    expect(core.setOutput).toHaveBeenCalledWith('type', 'fix')
    expect(core.setOutput).toHaveBeenCalledWith('scope', 'main')
    expect(core.setOutput).toHaveBeenCalledWith(
      'subject',
      'undo the confrigulators'
    )
    expect(core.setOutput).toHaveBeenCalledWith('breaking_change', 'true')
  })

  test('should handle invalid pull request title and fail when fail_when_invalid is true', async () => {
    github.context.eventName = 'pull_request'
    github.context.payload = {
      pull_request: {
        title: 'invalid title',
        number: 2
      }
    }
    ;(core.getBooleanInput as jest.Mock).mockReturnValue(true)

    await run()

    expect(core.setOutput).toHaveBeenCalledWith('valid', 'false')
    expect(core.error).toHaveBeenCalledWith(
      expect.stringContaining('Unable to parse title')
    )
    expect(core.setFailed).toHaveBeenCalledWith(
      'Pull Request title is not valid'
    )
  })

  test('should handle invalid pull request title and not fail when fail_when_invalid is false', async () => {
    github.context.eventName = 'pull_request'
    github.context.payload = {
      pull_request: {
        title: 'invalid title',
        number: 3
      }
    }
    ;(core.getBooleanInput as jest.Mock).mockReturnValue(false)

    await run()

    expect(core.setOutput).toHaveBeenCalledWith('valid', 'false')
    expect(core.error).toHaveBeenCalledWith(
      expect.stringContaining('Unable to parse title')
    )
    expect(core.setFailed).not.toHaveBeenCalled()
  })
})

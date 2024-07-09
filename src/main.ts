import * as core from '@actions/core'
import * as github from '@actions/github'
import {
  parser,
  toConventionalChangelogFormat
} from '@conventional-commits/parser'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    if (github.context.eventName !== 'pull_request') {
      core.setFailed(
        `Invalid event: ${github.context.eventName}. This action can only be used on 'pull_request'`
      )
      return
    }

    const failWhenInvalid = core.getBooleanInput('fail_when_invalid', {
      required: false
    })

    const title = String(github.context.payload.pull_request?.title)
    core.info(`Title: ${title}`)

    try {
      const ast = parser(title)
      const commit = toConventionalChangelogFormat(ast)

      // Set outputs for other workflow steps to use
      core.setOutput('valid', 'true')
      core.setOutput('title', title)
      core.setOutput('type', commit.type)
      core.setOutput('scope', commit.scope ?? '')
      core.setOutput('subject', commit.subject)
      core.setOutput(
        'breaking_change',
        commit.notes.some(note => note.title === 'BREAKING CHANGE')
          ? 'true'
          : 'false'
      )
    } catch (error) {
      core.setOutput('valid', 'false')
      core.error(`Unable to parse title. Error: ${error}`)

      if (failWhenInvalid) {
        core.setFailed(`Pull Request title is not valid`)
      }
    }
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}

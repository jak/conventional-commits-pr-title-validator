# Conventional Commits in PR Title - GitHub Action

<img src="./badges/coverage.svg" alt="coverage badge">

> A no-frills GitHub Action to validate the Pull Request title follows
> [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)
>
> No need to install anything on your runner to use it. Deliberately simple.

## Usage

This action validates the title of pull request automatically. This action only
works on `pull_request` events.

To use it, add the following steps in your workflow:

### Simple Usage

```yaml
steps:
  - uses: jak/conventional-commits-pr-title-action@v1
```

Set the action to be a required check in your repository and voilà, you can
ensure all merges will have a valid title.

### Advanced Usage

If you want to add extra validation, or do anything custom, you can use the
output variables of the action.

```yaml
steps:
  - id: pr-title
    uses: jak/conventional-commits-pr-title-action@v1
  - name: Only allow feat and fix type commits
    run: exit 1
    if:
      ${{ contains(['feat', 'fix'],
      fromJSON(steps.pr-title.outputs.commit).type) }}
```

## Inputs

### `fail_when_invalid`

**Possible values: `true` or `false`**

Determines whether the Action should fail when the title could not be parsed as
valid Conventional Commit format.

Useful if you want to compose this Action with others.

## Outputs

### `valid`

**Possible values: `"true"` or `"false"`**

> Note: GitHub Action outputs are always strings

### `title`

Re-export of the pull request title

### `type`

The type of change, for example:

- `feat` in `feat(parser): add ability to parse arrays`
- `fix` in `fix(formatter): dollar symbols should not cause errors`

### `scope`

The scope of the change, for example:

- `parser` in `feat(parser): add ability to parse arrays`
- `formatter` in `fix(formatter): dollar symbols should not cause errors`

### `subject`

The subject of the change, for example:

- `add ability to parse arrays` in `feat(parser): add ability to parse arrays`
- `dollar symbols should not cause errors` in
  `fix(formatter): dollar symbols should not cause errors`

### `breaking_change`

Possible values: `"true"` or `"false"`

> Note: GitHub Action outputs are always strings

Whether the commit indicates a breaking change. This is denoted with a `!`
appended after the type/scope.

According to the
[specification](https://www.conventionalcommits.org/en/v1.0.0/), a breaking
change can also be denoted by `BREAKING CHANGE:` in the footer of the commit,
however this Action only inspects the PR title.

## Contributing

Contributions, issues and feature requests are welcome.

## Show your support

Give a ⭐️ if this project helped you!

## License

MIT

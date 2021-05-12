defaultBranch=master

for branch in $(cat package.json | jq .publishing | jq -r keys[]) ; do
  echo "Selected configuration: $branch"

  rawRepository=$(cat package.json | jq -r .publishing.$branch.repository)
  repository=$(cat package.json | jq -r .publishing.$branch.repository)
  defaultRepository=$(cat package.json | jq -r .publishing.$defaultBranch.repository)

  if [ $repository = $defaultRepository ]; then
    echo "Changing to default repository: $repository"
    echo "$( jq --arg repository "$repository" '.repository = $repository' package.json )" > package.json
  elif [ $rawRepository != 'null' ]; then
    echo "Changing to mirror repository: $repository"
    echo "$( jq --arg repository "$repository" '.repository = $repository' package.json )" > package.json
  fi

  registry=$(cat package.json | jq -r .publishing.$branch.publishConfig.registry)
  echo "Publishing to package repository: $registry"
  npm publish --registry=$registry --access public
  git reset --hard
done

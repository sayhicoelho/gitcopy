#!/usr/bin/env node
const { exec } = require('child_process')
const fs = require('fs')
const path = require('path')
const commitHashFrom = process.argv[2]
const commitHashTo = process.argv[3]

exec('git log --oneline', (err, stdout, stderr) => {
  if (err) {
    console.error(err)
  } else if (stderr) {
    console.error(stderr)
  } else {
    const commits = stdout.split('\n')
    const commitHash = commitHashFrom && commitHashTo
      ? `${commitHashFrom} ${commitHashTo}`
      : commits[1].substr(0, 7)

    exec(`git diff ${commitHash} --name-only`, (err, stdout, stderr) => {
      if (err) {
        console.error(err)
      } else if (stderr) {
        console.error(stderr)
      } else {
        const files = stdout.split('\n').filter(f => f)

        for (const file of files) {
          const fileName = path.basename(file)
          const fileDir = path.dirname(file)

          fs.mkdir(`./.gitcopy/${fileDir}`, { recursive: true }, err => {
            if (err) {
              console.error(err)
            } else {
              fs.copyFile(`./${file}`, `./.gitcopy/${fileDir}/${fileName}`, () => {
                console.log(`.gitcopy/${fileDir}/${fileName}`)
              })
            }
          })
        }
      }
    })
  }
})

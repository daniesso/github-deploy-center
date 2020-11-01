import { Box, CircularProgress, TextField, Typography } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import { orderBy } from 'lodash-es'
import React, { FC } from 'react'
import { useActions, useOvermindState } from '../overmind'
import { useFetchRepos } from './fetchHooks'

export const RepoSearchView: FC = () => {
  const { data, error, isLoading } = useFetchRepos()
  const { selectedRepo } = useOvermindState()
  const { setSelectedRepo } = useActions()

  const options = orderBy(data ?? [], (d) => d.owner.toLowerCase())

  return (
    <>
      <Typography variant="h2">Repositories</Typography>
      {error instanceof Error ? (
        <Typography>Error: {error.message}</Typography>
      ) : (
        <Autocomplete
          loading={isLoading}
          options={options}
          id="search-repos"
          renderInput={(params) => (
            <TextField
              variant="outlined"
              label="Search"
              {...params}
              InputProps={{
                ...params.InputProps,
                startAdornment:
                  isLoading && !selectedRepo ? (
                    <Box
                      maxWidth={24}
                      maxHeight={24}
                      ml={1}
                      component={CircularProgress}></Box>
                  ) : null,
              }}
            />
          )}
          groupBy={(r) => r.owner}
          getOptionLabel={(r) => r.name}
          getOptionSelected={(first, second) => first.id === second.id}
          value={selectedRepo}
          autoHighlight
          onChange={(_, value) => setSelectedRepo(value)}
        />
      )}
    </>
  )
}

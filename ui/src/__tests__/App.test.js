import App from '../App.js'
import { MockedProvider } from '@apollo/client/testing'
import { screen, render } from '@testing-library/react'
import { GET_BUGS } from '../graphql.js'

describe('<App/>', () => {
  it('renders a no bugs listitem when no bugs are found', async () => {
    const mocks = [
      {
        request: {
          query: GET_BUGS,
        },
        result: {
          data: {
            bugs: [],
          },
        },
      },
    ]

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <App noBugs="nope!" />
      </MockedProvider>,
    )

    const items = await screen.findAllByText('nope!')
    expect(items).toHaveLength(1)
  })

  it('renders a list of bugs from the API', async () => {
    const mocks = [
      {
        request: {
          query: GET_BUGS,
        },
        result: {
          data: {
            bugs: [
              { id: '1', title: 'XSS', description: 'very bad' },
              { id: '2', title: 'buffer overflow', description: 'even worse' },
            ],
          },
        },
      },
    ]

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <App />
      </MockedProvider>,
    )

    const bugs = await screen.findAllByRole('listitem')
    expect(bugs).toHaveLength(2)
  })
})

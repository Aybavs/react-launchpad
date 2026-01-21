import { Button } from '../button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../card'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Card>

export const Default: Story = {
  args: {
    children: null,
  },
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This is the card content area. You can put any content here.</p>
      </CardContent>
    </Card>
  ),
}

export const WithFooter: Story = {
  args: {
    children: null,
  },
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Card with Footer</CardTitle>
        <CardDescription>
          This card includes a footer with actions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card content with some example text.</p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm">
          Cancel
        </Button>
        <Button variant="default" size="sm">
          Save
        </Button>
      </CardFooter>
    </Card>
  ),
}

export const Simple: Story = {
  args: {
    children: null,
  },
  render: () => (
    <Card>
      <p>A simple card with just content</p>
    </Card>
  ),
}

export const WithList: Story = {
  args: {
    children: null,
  },
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Features</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="list-disc list-inside space-y-2">
          <li>Feature one</li>
          <li>Feature two</li>
          <li>Feature three</li>
        </ul>
      </CardContent>
    </Card>
  ),
}

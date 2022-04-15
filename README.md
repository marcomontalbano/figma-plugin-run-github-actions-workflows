# Figma Plugin - Trigger GitHub Actions

Trigger [GitHub Actions](https://github.com/features/actions) from [Figma](https://www.figma.com/) sending the selected page and all selected nodes as [inputs](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#onworkflow_dispatchinputs).

![Demo](demo.gif)


## Usage

### Figma

Setup on Figma is straightforward. You just need to setup a new action clicking on the `+` button. You'll need a GitHub [Access Token](https://github.com/settings/tokens) to dispatch actions.

After that, you can select a `page` and one or more `nodes` from that page and click on `►`. This will trigger the selected action, passing your selection as action' inputs.

### GitHub

Before triggering an action for the first time, you'll need to properly setup a GitHub Action :smiley:.

The GitHub Action needs to have a set of inputs (the same that the plugin will send):

```yaml
on: 
  workflow_dispatch:
    inputs:
      fileKey:
        description: Figma file key
        type: string
        required: true
      page:
        description: Stringified selected page (id, name)
        type: string
        default: '{}'
        required: true
      selection:
        description: Stringified array of the selected nodes (id, name)
        type: string
        default: '[]'
        required: true
```

Aside from this, you'll just need to configure the action as you prefer.

Checkout a working example [`from-figma.yaml`](.github/workflows/from-figma.yaml).

As you can see inside the above example, you can also transform/manipulate the received inputs in order to shape them as you want.


## Figma Export PDFs

What do you think about exporting Figma content as PDF to an FTP Server, staying on Figma and just clicking a button? Would it be cool, isn't it?

Take a look at this [workflow](https://github.com/marcomontalbano/figma-export-pdfs-action/blob/main/.github/workflows/from-figma.yaml) and find out how this is totaly feasable. Just clone the workflow and setup the Figma plugin :wink:

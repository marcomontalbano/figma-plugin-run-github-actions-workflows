# Figma Plugin - Run GitHub Actions workflows

Run [GitHub Actions](https://github.com/features/actions) workflows from [Figma](https://www.figma.com/) sending the selected page and all selected nodes as [inputs](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#onworkflow_dispatchinputs).

![Demo](cover.gif)


## Usage

### Figma

Setup on Figma is straightforward. You just need to setup a new workflow clicking on the `+` button. You'll need a GitHub [Access Token](https://github.com/settings/tokens) to run workflows.

After that, you can select a `page` and one or more `nodes` from that page and click on `▶`. This will run the selected workflow, passing your selection as workflow' inputs.

### GitHub

Before running a workflow for the first time, you'll need to properly setup a [GitHub Actions workflow](https://docs.github.com/en/actions/using-workflows) :smiley:.

The GitHub Actions workflow needs to have a set of inputs (the same that the plugin will send):

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

Aside from this, you'll just need to configure the workflow as you prefer.

Checkout a working example [`from-figma.yaml`](.github/workflows/from-figma.yaml).

As you can see inside the above example, you can also transform/manipulate the received inputs in order to shape them as you want.


## Figma Export PDFs

What do you think about *exporting Figma content as PDF to an FTP Server, just clicking a button from Figma*? Would it be cool, isn't it?

Take a look at this [workflow](https://github.com/marcomontalbano/figma-export-pdfs-action/blob/main/.github/workflows/from-figma.yaml) and find out how this is totally feasible. Just clone the workflow and setup this Figma plugin :wink:

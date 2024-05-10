import { VerticalSpace } from '@create-figma-plugin/ui';
import { h, Fragment, type FunctionalComponent } from 'preact';

export const Title: FunctionalComponent = ({ children }) => (
  <Fragment>
    <VerticalSpace space="large" />
    <h3 style={{ flexGrow: 1 }}>{children}</h3>
  </Fragment>
)

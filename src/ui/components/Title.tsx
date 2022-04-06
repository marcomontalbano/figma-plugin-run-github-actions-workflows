import { VerticalSpace } from '@create-figma-plugin/ui';
import { h, Fragment, FunctionalComponent } from 'preact';

export const Title: FunctionalComponent = ({ children }) => (
  <Fragment>
    <VerticalSpace space="large" />
    <h3>{children}</h3>
  </Fragment>
)

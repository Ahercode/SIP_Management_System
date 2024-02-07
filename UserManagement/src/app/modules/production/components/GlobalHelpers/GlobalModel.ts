export type ColumnProps = {
  title: string;
  dataIndex?: string;
  sorter?: (a: any, b: any) => number;
  fixed?: 'right';
  width?: number;
  render?: (_: any, record: any) => JSX.Element;
};
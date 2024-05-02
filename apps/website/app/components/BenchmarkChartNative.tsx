import { BenchmarkChart } from './BenchmarkChart'

export const BenchmarkChartNative = () => (
  <BenchmarkChart
    large
    data={[
      { name: 'Tamagui', value: 108 },
      { name: 'React Native', value: 106 },
      { name: 'NativeBase', value: 247 },
    ]}
  />
)

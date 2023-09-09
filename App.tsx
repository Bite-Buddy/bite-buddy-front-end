import AppEntry from './AppEntry'
import { StateProvider } from './store/State';

export default function App() {
 return (
  <StateProvider>
    <AppEntry />
  </StateProvider>
 )
}
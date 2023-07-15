import { useAlertsStore } from '@/stores'

const alertStore = useAlertsStore()
export default function (item: any, timeInMilliseconds: number): void {
  // Add the item to the array

  // Schedule the removal of the item after the specified time
  setTimeout(() => {
    // Find the index of the item in the array
    const index = alertStore.$state.tosts.indexOf(item)

    // Remove the item from the array if it exists
    if (index !== -1)
      alertStore.$state.tosts.splice(index, 1)
  }, timeInMilliseconds)
}

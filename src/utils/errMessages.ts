import { toast } from 'vue3-toastify'

export function showErrorMessageSignIn(error: { code: string }): void {
  switch (error.code) {
    case 'auth/invalid-email':
      toast.error('Invalid email')
      break
    case 'auth/user-not-found':
      toast.error('No account with that email was found')
      break
    case 'auth/wrond-password':
      toast.error('Incorrect password')
      break
    case 'auth/email-already-in-use':
      toast.error('User with this email already exists')
      break
    default:
      toast.error('Email or password was incorrect')
      break
  }
}

// export function showAddTaskMessage(taskAdd, boolAdded) {
//   taskAdd.value = boolAdded
//   setTimeout(() => {
//     taskAdd.value = null
//   }, 2000)
// }

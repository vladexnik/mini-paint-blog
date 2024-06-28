<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import {
  getStorage,
  ref as refFirebase,
  getDownloadURL,
  listAll,
  getMetadata
} from 'firebase/storage'
import HeaderPage from './HeaderPage.vue'
import Loader from '../loader/LoaderComponent.vue'
import { useLoader } from '../composables/useLoader'
import type { IUseLoader } from '../../models/models'
import type { DataObjT } from '../../models/models'

const storage = getStorage()
const data = ref<DataObjT[]>([])
let inputString = ref<string>('')
const { isLoading, showLoader, hideLoader }: IUseLoader = useLoader()

async function listAllFilesAndMetadata(prefix = ''): Promise<void> {
  showLoader()
  try {
    const storageRef = refFirebase(storage, prefix)
    const result = await listAll(storageRef)
    console.log(result, 'result')
    for (const itemRef of result.items) {
      const metadata = await getMetadata(itemRef)
      const downloadURL = await getDownloadURL(itemRef)

      const objectFile: any = {
        name: metadata.customMetadata?.userEmail,
        timestamp: Number(metadata.customMetadata?.date),
        url: downloadURL
      }
      data.value.push(objectFile)
    }

    for (const folderRef of result.prefixes) {
      await listAllFilesAndMetadata(folderRef.fullPath)
    }
  } catch (error) {
    console.error('Error listing files and metadata:', error)
  } finally {
    data.value = data.value.sort((obj1, obj2) => obj2.timestamp - obj1.timestamp)
    hideLoader()
  }
}

const filtered = computed(() =>
  data.value.filter((item: DataObjT) => item.name && item.name.includes(inputString.value))
)

onMounted(async () => {
  await listAllFilesAndMetadata()
  console.log(filtered.value)
})
</script>

<template>
  <div v-if="filtered">
    <div class="container">
      <HeaderPage />
      <div class="main">
        <h1 class="main__title">Home Page with info how i cool</h1>
        <input
          type="text"
          class="main__input"
          v-model.trim="inputString"
          name=""
          placeholder="Enter user's email"
        />
        <ul class="main__list" v-if="filtered.length > 3">
          <li class="main__item" v-for="file in filtered" v-bind:key="file.timestamp">
            <div class="main__item-context">
              <p class="main__item-text user-email"><span>Created by</span> {{ file?.name }}</p>
              <p class="main__item-text date">
                <span>Published </span>{{ new Date(file?.timestamp).toString().slice(0, 24) }}
              </p>
            </div>
            <img class="main__item-img" :src="file.url" alt="" v-if="file.url" />
            <div v-else>Loading image...</div>
          </li>
        </ul>
        <div>
          <Loader :isLoading="isLoading" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.main__input {
  border-radius: 25px;
  padding: 10px;
  max-width: 520px;
  width: 100%;
  margin-top: 20px;
  background-color: var(--background-color);
  color: var(--color);
  border: 1px solid var(--color);
}

.main {
  max-width: 750px;
  margin: 0 auto;
  text-align: center;
}

.main__title {
  color: var(--secondary-color);
}
.main__list {
  max-width: 550px;
  margin: 0 auto;
  margin-top: 20px;
}

.main__item {
  display: block;
  margin-bottom: 20px;
}

.main__item-img {
  margin: 0 auto;
  max-width: 550px;
  width: 100%;
  aspect-ratio: 8 / 5;
  border: 1px solid var(--color);
  border-radius: 20px;
}

.main__item-context {
  display: flex;
  justify-content: space-between;
  padding: 5px 10px;
  gap: 25px;
}
</style>

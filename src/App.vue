<script setup lang="ts">
declare module 'vue3-particles'
import type { Container, Engine } from 'tsparticles-engine'
import { loadFull } from 'tsparticles'
import { onMounted, onBeforeMount } from 'vue'
import pconf from './assets/particles.json'
import { useKimaiStore } from './stores/kimai'
import { Switch, SwitchGroup, SwitchLabel } from '@headlessui/vue'

const showSettings = ref(false)
const open = ref(false)

let keyBuffer = ''

const particlesInit = async (engine: Engine) => {
  await loadFull(engine)

  console.log(engine)
}

const particlesLoaded = async (container: Container) => {
  console.log(container)
}

const store = useKimaiStore()

onBeforeMount(() => {
  store.loadUsers()
  store.loadProjects()
  store.loadActivities()
})

onMounted(() => {
  document.body.classList.add('bg-black')
})

document.onkeydown = function (evt) {
  console.log(evt)
  if (!isNaN(evt.key)) {
    keyBuffer = keyBuffer.concat(evt.key)
  }
  if (evt.key == 'Enter') {
    console.log(keyBuffer)
    console.log(store.userMapping)
    console.log('KEYBUFF', keyBuffer)
    store.toggleTimesheetRecordState(+keyBuffer)
    keyBuffer = ''
  }
}

function triggerActivityUpdate() {
  store.loadActivities()
}

import { ref } from 'vue'
import {
  Listbox,
  ListboxButton,
  ListboxLabel,
  ListboxOption,
  ListboxOptions,
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot
} from '@headlessui/vue'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/20/solid'
</script>

<template>
  <div>
    <vue-particles
      id="tsparticles"
      :options="pconf"
      :particlesInit="particlesInit"
      :particlesLoaded="particlesLoaded"
    />

    <div class="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="mt-10 sm:mx-auto sm:w-full sm:min-w-[920px]">
        <div class="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
          <p>Scan Employee ID</p>
          <br />
          <TransitionRoot as="template" :show="store.showDialog">
            <Dialog as="div" class="relative z-10" @close="store.showDialog = false">
              <TransitionChild
                as="template"
                enter="ease-out duration-300"
                enter-from="opacity-0"
                enter-to="opacity-100"
                leave="ease-in duration-200"
                leave-from="opacity-100"
                leave-to="opacity-0"
              >
                <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
              </TransitionChild>

              <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div
                  class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
                >
                  <TransitionChild
                    as="template"
                    enter="ease-out duration-300"
                    enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    enter-to="opacity-100 translate-y-0 sm:scale-100"
                    leave="ease-in duration-200"
                    leave-from="opacity-100 translate-y-0 sm:scale-100"
                    leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  >
                    <DialogPanel
                      class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6"
                    >
                      <div>
                        <div
                          class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100"
                        >
                          <CheckIcon class="h-6 w-6 text-green-600" aria-hidden="true" />
                        </div>
                        <div class="mt-3 text-center sm:mt-5">
                          <DialogTitle
                            as="h3"
                            class="text-base font-semibold leading-6 text-gray-900"
                            >{{ store.dialogTitle }} Success!</DialogTitle
                          >
                          <div class="mt-2">
                            <p class="text-sm text-gray-500">
                              Thank you, {{ store.dialogName }}
                            </p>
                          </div>
                        </div>
                      </div>
                    </DialogPanel>
                  </TransitionChild>
                </div>
              </div>
            </Dialog>
          </TransitionRoot>

          <SwitchGroup as="div" class="flex items-center">
            <Switch
              v-model="showSettings"
              :class="[
                showSettings ? 'bg-indigo-600' : 'bg-gray-200',
                'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2'
              ]"
            >
              <span
                aria-hidden="true"
                :class="[
                  showSettings ? 'translate-x-5' : 'translate-x-0',
                  'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                ]"
              />
            </Switch>
            <SwitchLabel as="span" class="ml-3 text-sm">
              <span class="font-medium text-gray-900">Show Settings (Admin Only)</span>
            </SwitchLabel>
          </SwitchGroup>
          <div :hidden="!showSettings">
            <Listbox
              as="div"
              v-model="store.selectedProject"
              @update:model-value="triggerActivityUpdate"
            >
              <ListboxLabel class="block text-sm font-medium leading-6 text-gray-900"
                >Project</ListboxLabel
              >
              <div class="relative mt-2">
                <ListboxButton
                  class="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                >
                  <span class="block truncate">{{ store.selectedProject.name }}</span>
                  <span
                    class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
                  >
                    <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </span>
                </ListboxButton>

                <transition
                  leave-active-class="transition ease-in duration-100"
                  leave-from-class="opacity-100"
                  leave-to-class="opacity-0"
                >
                  <ListboxOptions
                    class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                  >
                    <ListboxOption
                      as="template"
                      v-for="project in store.projects"
                      :key="project.id"
                      :value="project"
                      v-slot="{ active, selectedProject }"
                    >
                      <li
                        :class="[
                          active ? 'bg-indigo-600 text-white' : 'text-gray-900',
                          'relative cursor-default select-none py-2 pl-3 pr-9'
                        ]"
                      >
                        <span
                          :class="[
                            selectedProject ? 'font-semibold' : 'font-normal',
                            'block truncate'
                          ]"
                          >{{ project.name }}</span
                        >

                        <span
                          v-if="selectedProject"
                          :class="[
                            active ? 'text-white' : 'text-indigo-600',
                            'absolute inset-y-0 right-0 flex items-center pr-4'
                          ]"
                        >
                          <CheckIcon class="h-5 w-5" aria-hidden="true" />
                        </span>
                      </li>
                    </ListboxOption>
                  </ListboxOptions>
                </transition>
              </div>
            </Listbox>

            <Listbox as="div" v-model="store.selectedActivity">
              <ListboxLabel class="block text-sm font-medium leading-6 text-gray-900"
                >Activity</ListboxLabel
              >
              <div class="relative mt-2">
                <ListboxButton
                  class="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                >
                  <span class="block truncate">{{ store.selectedActivity.name }}</span>
                  <span
                    class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
                  >
                    <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </span>
                </ListboxButton>

                <transition
                  leave-active-class="transition ease-in duration-100"
                  leave-from-class="opacity-100"
                  leave-to-class="opacity-0"
                >
                  <ListboxOptions
                    class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                  >
                    <ListboxOption
                      as="template"
                      v-for="activity in store.activities"
                      :key="activity.id"
                      :value="activity"
                      v-slot="{ active, selectedActivity }"
                    >
                      <li
                        :class="[
                          active ? 'bg-indigo-600 text-white' : 'text-gray-900',
                          'relative cursor-default select-none py-2 pl-3 pr-9'
                        ]"
                      >
                        <span
                          :class="[
                            selectedActivity ? 'font-semibold' : 'font-normal',
                            'block truncate'
                          ]"
                          >{{ activity.name }}</span
                        >

                        <span
                          v-if="selectedActivity"
                          :class="[
                            active ? 'text-white' : 'text-indigo-600',
                            'absolute inset-y-0 right-0 flex items-center pr-4'
                          ]"
                        >
                          <CheckIcon class="h-5 w-5" aria-hidden="true" />
                        </span>
                      </li>
                    </ListboxOption>
                  </ListboxOptions>
                </transition>
              </div>
            </Listbox>
            <div>
              <label for="email" class="block text-sm font-medium leading-6 text-gray-900"
                >Kimai Server URL</label
              >
              <div class="mt-2">
                <input
                  v-model="store.API_URL"
                  type="url"
                  name="url"
                  id="url"
                  class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder=""
                />
              </div>
            </div>
            <div>
              <label for="email" class="block text-sm font-medium leading-6 text-gray-900"
                >Kimai Auth ID</label
              >
              <div class="mt-2">
                <input
                  v-model="store.axiosConfig.headers['X-AUTH-USER']"
                  type="text"
                  name="auth_id"
                  id="auth_id"
                  class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder=""
                />
              </div>
            </div>
            <div>
              <label for="email" class="block text-sm font-medium leading-6 text-gray-900"
                >Kimai Auth Token</label
              >
              <div class="mt-2">
                <input
                  v-model="store.axiosConfig.headers['X-AUTH-TOKEN']"
                  type="password"
                  name="auth_token"
                  id="auth_token"
                  class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder=""
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="$emit('close')">
    <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
      <!-- Header -->
      <div class="p-4 border-b flex items-center justify-between">
        <h2 class="text-lg font-semibold">Export Preview</h2>
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">
          <XIcon class="w-5 h-5" />
        </button>
      </div>

      <!-- Options Panel -->
      <div class="border-b p-4 bg-gray-50">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <!-- Page Size -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Page Size</label>
            <select 
              v-model="options.pageSize"
              class="w-full rounded border-gray-300 text-sm"
            >
              <option value="letter">Letter</option>
              <option value="a4">A4</option>
              <option value="legal">Legal</option>
              <option value="tabloid">Tabloid</option>
            </select>
          </div>

          <!-- Orientation -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Orientation</label>
            <select 
              v-model="options.orientation"
              class="w-full rounded border-gray-300 text-sm"
            >
              <option value="portrait">Portrait</option>
              <option value="landscape">Landscape</option>
            </select>
          </div>

          <!-- Scale -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Scale</label>
            <select 
              v-model="options.scale"
              class="w-full rounded border-gray-300 text-sm"
            >
              <option :value="1">1x</option>
              <option :value="2">2x</option>
              <option :value="3">3x</option>
            </select>
          </div>

          <!-- Quality -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Quality</label>
            <select 
              v-model="options.quality"
              class="w-full rounded border-gray-300 text-sm"
            >
              <option :value="0.8">Low (80%)</option>
              <option :value="0.9">Medium (90%)</option>
              <option :value="0.95">High (95%)</option>
              <option :value="1">Best (100%)</option>
            </select>
          </div>
        </div>

        <!-- Advanced Options -->
        <div class="mt-4 space-y-4">
          <!-- Margins -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Margin (inches)</label>
            <input 
              type="number" 
              v-model.number="options.margin"
              min="0"
              max="2"
              step="0.25"
              class="w-full rounded border-gray-300 text-sm"
            />
          </div>

          <!-- Header & Footer -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Header Text</label>
              <input 
                type="text" 
                v-model="options.headerText"
                placeholder="Optional header text"
                class="w-full rounded border-gray-300 text-sm"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Footer Text</label>
              <input 
                type="text" 
                v-model="options.footerText"
                placeholder="Optional footer text"
                class="w-full rounded border-gray-300 text-sm"
              />
            </div>
          </div>

          <!-- Watermark -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Watermark</label>
            <input 
              type="text" 
              v-model="options.watermark"
              placeholder="Optional watermark text"
              class="w-full rounded border-gray-300 text-sm"
            />
          </div>

          <!-- Theme -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Theme</label>
            <div class="flex items-center space-x-4">
              <label class="inline-flex items-center">
                <input 
                  type="radio" 
                  v-model="options.theme"
                  value="light"
                  class="form-radio text-blue-500"
                />
                <span class="ml-2 text-sm">Light</span>
              </label>
              <label class="inline-flex items-center">
                <input 
                  type="radio" 
                  v-model="options.theme"
                  value="dark"
                  class="form-radio text-blue-500"
                />
                <span class="ml-2 text-sm">Dark</span>
              </label>
            </div>
          </div>

          <!-- Password Protection -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Password Protection</label>
            <input 
              type="password" 
              v-model="options.password"
              placeholder="Optional PDF password"
              class="w-full rounded border-gray-300 text-sm"
            />
          </div>

          <!-- Metadata -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">Document Metadata</label>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input 
                type="text" 
                v-model="options.metadata.title"
                placeholder="Document Title"
                class="w-full rounded border-gray-300 text-sm"
              />
              <input 
                type="text" 
                v-model="options.metadata.author"
                placeholder="Author"
                class="w-full rounded border-gray-300 text-sm"
              />
              <input 
                type="text" 
                v-model="options.metadata.subject"
                placeholder="Subject"
                class="w-full rounded border-gray-300 text-sm"
              />
              <input 
                type="text" 
                v-model="keywordsInput"
                placeholder="Keywords (comma separated)"
                class="w-full rounded border-gray-300 text-sm"
                @input="updateKeywords"
              />
            </div>
          </div>

          <!-- Compression -->
          <div>
            <label class="inline-flex items-center">
              <input 
                type="checkbox" 
                v-model="options.compression"
                class="form-checkbox text-blue-500"
              />
              <span class="ml-2 text-sm">Enable PDF compression</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Preview -->
      <div class="flex-1 overflow-auto p-4">
        <div 
          class="bg-white shadow-lg mx-auto transition-all duration-200"
          :class="{
            'max-w-[8.5in]': options.pageSize === 'letter' && options.orientation === 'portrait',
            'max-w-[11in]': options.pageSize === 'letter' && options.orientation === 'landscape',
            'max-w-[210mm]': options.pageSize === 'a4' && options.orientation === 'portrait',
            'max-w-[297mm]': options.pageSize === 'a4' && options.orientation === 'landscape'
          }"
          :style="{ padding: `${options.margin}in` }"
        >
          <PDFReport
            :stats="stats"
            :summary="summary"
          />
        </div>
      </div>

      <!-- Actions -->
      <div class="p-4 border-t bg-gray-50 flex justify-end space-x-4">
        <!-- Share Dropdown -->
        <div class="relative">
          <button 
            @click="showShareOptions = !showShareOptions"
            class="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 flex items-center space-x-2"
            :disabled="isSharing"
          >
            <ShareIcon v-if="!isSharing" class="w-4 h-4" />
            <Loader2Icon v-else class="w-4 h-4 animate-spin" />
            <span>{{ isSharing ? 'Sharing...' : 'Share' }}</span>
            <ChevronDownIcon class="w-4 h-4" />
          </button>

          <!-- Share Options Dropdown -->
          <div 
            v-if="showShareOptions"
            class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50"
          >
            <div class="py-1">
              <button
                @click="handleShare('email')"
                class="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 flex items-center"
              >
                <MailIcon class="w-4 h-4 mr-2" />
                <span>Email</span>
              </button>
              <button
                @click="handleShare('clipboard')"
                class="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 flex items-center"
              >
                <ClipboardIcon class="w-4 h-4 mr-2" />
                <span>Copy to Clipboard</span>
              </button>
              <button
                @click="handleShare('print')"
                class="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 flex items-center"
              >
                <PrinterIcon class="w-4 h-4 mr-2" />
                <span>Print</span>
              </button>
              <div class="border-t border-gray-100">
                <button
                  @click="handleShare('social', 'twitter')"
                  class="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <TwitterIcon class="w-4 h-4 mr-2" />
                  <span>Share on Twitter</span>
                </button>
                <button
                  @click="handleShare('social', 'linkedin')"
                  class="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <LinkedinIcon class="w-4 h-4 mr-2" />
                  <span>Share on LinkedIn</span>
                </button>
                <button
                  @click="handleShare('social', 'facebook')"
                  class="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <FacebookIcon class="w-4 h-4 mr-2" />
                  <span>Share on Facebook</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <button 
          @click="handleExport"
          class="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center space-x-2"
          :disabled="isExporting"
        >
          <DownloadIcon v-if="!isExporting" class="w-4 h-4" />
          <Loader2Icon v-else class="w-4 h-4 animate-spin" />
          <span>{{ isExporting ? 'Exporting...' : 'Download PDF' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted, onUnmounted } from 'vue'
import { 
  XIcon, 
  DownloadIcon, 
  ShareIcon,
  MailIcon, 
  ClipboardIcon,
  PrinterIcon,
  TwitterIcon,
  LinkedinIcon,
  FacebookIcon,
  ChevronDownIcon,
  Loader2Icon 
} from 'lucide-vue-next'
import PDFReport from './PDFReport.vue'
import { exportReport, exportReportToBlob, type PDFExportOptions } from '@/lib/pdf/exportReport'
import { sharePDF } from '@/lib/pdf/shareReport'

interface Props {
  stats: {
    completed: number
    inProgress: number
    focusMinutes: number
    weekStart: string
    weekEnd: string
    byPriority: {
      high: number
      medium: number
      low: number
    }
    byDay: Record<string, number>
  }
  summary: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'export-start'): void
  (e: 'export-end'): void
}>()

const isExporting = ref(false)
const isSharing = ref(false)
const showShareOptions = ref(false)
const keywordsInput = ref('')

const options = reactive<PDFExportOptions>({
  filename: 'weekly-productivity-report',
  pageSize: 'letter',
  orientation: 'portrait',
  margin: 0.5,
  scale: 2,
  watermark: '',
  headerText: '',
  footerText: '',
  theme: 'light',
  quality: 0.95,
  password: '',
  compression: true,
  metadata: {
    title: 'Weekly Productivity Report',
    author: '',
    subject: 'Task Management Summary',
    keywords: []
  }
})

// Update keywords when input changes
const updateKeywords = () => {
  options.metadata.keywords = keywordsInput.value
    .split(',')
    .map(k => k.trim())
    .filter(k => k.length > 0)
}

// Close share options when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.share-dropdown')) {
    showShareOptions.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const handleExport = async () => {
  if (isExporting.value) return

  isExporting.value = true
  emit('export-start')

  try {
    await exportReport('pdf-report', options)
  } catch (e) {
    console.error('Export failed:', e)
  } finally {
    isExporting.value = false
    emit('export-end')
  }
}

const handleShare = async (method: 'email' | 'clipboard' | 'print' | 'social', socialPlatform?: 'twitter' | 'linkedin' | 'facebook') => {
  if (isSharing.value) return

  isSharing.value = true
  showShareOptions.value = false

  try {
    const blob = await exportReportToBlob('pdf-report', options)
    await sharePDF(blob, options.filename, {
      method,
      socialPlatform,
      subject: 'Weekly Productivity Report',
      body: 'Here is your weekly productivity report.'
    })
  } catch (e) {
    console.error('Sharing failed:', e)
  } finally {
    isSharing.value = false
  }
}
</script> 
<template>
  <div class="app-container">
    <div class="headerspan">
      <span style="font-size:20px;padding-top:20px;display:inline-block;">Product</span>
      <el-divider />
    </div>
    <el-row>
      <el-col :span="10">
        <div class="chart-wrapper align-right">
          <MultipleImageUploader
            :data-images="images"
            :max-image="9"
            primary-text="Default"
            browse-text="Browser Picture(s)"
            drag-text="Drag Picture(s)"
            mark-is-primary-text="Set as default"
            popup-text="This image will be displayed as default"
            @upload-success="uploadImageSuccess"
            @edit-image="editImage"
          />
        </div>
      </el-col>
      <el-col :span="12">
        <div class="chart-wrapper">
          <el-form
            ref="productForm"
            :model="productForm"
            :rules="rules"
            label-width="150px"
            onautocomplete="on"
            class="defectForm"
            span="12"
          >
            <!-- <el-form-item label="????" prop="project_id">
            <el-select v-model="defectForm.project_id" class="selector" placeholder="???????" :disabled="isEditting">
              <el-option
                v-for="item in projects_doing"
                :key="item.project_id"
                :label="item.name"
                :value="item.project_id"
              />
            </el-select>
          </el-form-item> -->
            <el-form-item label="Product Title" prop="title">
              <el-input v-model="productForm.title" class="title-input" />
            </el-form-item>

            <el-form-item label="Product Description" prop="description">
              <el-input v-model="productForm.description" type="textarea" class="description-input" size="large" />
            </el-form-item>

            <el-form-item label="Catalog" prop="cate1">
              <el-select v-model="productForm.cate1" class="selector" placeholder="Please Select Catelog">
                <el-option
                  v-for="item in productCat"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="Start Time" prop="startTime">
              <el-date-picker
                v-model="productForm.startTime"
                type="datetime"
                format="yyyy-MM-dd HH:mm"
                placeholder="Select date and time"
              />
            </el-form-item>

            <el-form-item label="End Time" prop="endTime">
              <el-date-picker
                v-model="productForm.endTime"
                type="datetime"
                format="yyyy-MM-dd HH:mm"
                placeholder="Select date and time"
              />
            </el-form-item>

            <el-form-item label="Start Price" prop="startPrice">
              <el-input
                v-model="productForm.startPrice"
                type="Number"
                placeholder="Start Price"
              />
            </el-form-item>

            <el-form-item label="Minimum Increment" prop="minIncrement">
              <el-input
                v-model="productForm.minIncrement"
                type="Number"
                placeholder="default to $1"
              />
            </el-form-item>

            <el-form-item label="Auto Win Price" prop="autoWinPrice">
              <el-input
                v-model="productForm.autoWinPrice"
                type="Number"
                placeholder="Auto Win Price"
              />
            </el-form-item>

            <el-form-item label="Reserved Price" prop="reservedPrice">
              <el-input
                v-model="productForm.reservedPrice"
                type="Number"
                placeholder="default to $0"
              />
            </el-form-item>

            <el-form-item>
              <el-button :loading="loading" type="primary" @click="submitForm()">Submit</el-button>
              <el-button @click="cancelForm()">Cancel</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// import * as defectApi from '@/api/defect'
// import * as projectApi from '@/api/project'
import { mapGetters } from 'vuex'
import MultipleImageUploader from '@/components/MultipleImageUploader'
import * as productApi from '@/api/product.js'
import { defaultProductForm, productCat } from '@/api/enum.js'

export default {
  name: 'DefectNew',
  components: { MultipleImageUploader },
  pid: 0,
  computed: {
    ...mapGetters(['roles', 'uid'])
  },
  data() {
    return {
      productForm: defaultProductForm,
      images: [],
      rules: {
        title: [
          { required: true, message: 'Please enter the product title.', trigger: 'blur' }
        ],
        description: [
          { required: true, message: 'Please enter the product description.', trigger: 'blur' }
        ],
        cate1: [
          { required: true, message: 'Please select a catalog.', trigger: 'change' }
        ],
        startTime: [
          { required: true, message: 'Please enter a start time.', trigger: 'change' }
        ],
        endTime: [
          { required: true, message: 'Please enter an end time.', trigger: 'change' }
        ],
        startPrice: [
          { required: true, message: 'Please enter a start price', trigger: 'blur' }
        ],
        autoWinPrice: [
          { required: true, message: 'Please enter an auto win price', trigger: 'blur' }
        ],
        minIncrement: [
          { required: true, message: 'Please enter a mini increment price for the biding', trigger: 'blur' }
        ],
        reservedPrice: [
        ]

      },
      productCat,
      loading: false,
      isEditting: false
    }
  },
  created() {
    this.isEditting = !!this.$route.params.pid
    if (this.isEditting) {
      this.pid = this.$route.params.pid
      this.populateSelectorData()
    }
  },
  methods: {
    uploadImageSuccess() {},
    editImage() {},
    populateSelectorData() {
      productApi.productDetail(this.pid).then(response => {
        this.productForm = response.data
      })
    },
    setupCreateFormData() {
      this.productForm.uid = this.uid
      this.productForm.startTime = new Date(this.productForm.startTime).toISOString()
      this.productForm.endTime = new Date(this.productForm.endTime).toISOString()
    },
    validateDates() {
      var startDate = new Date(this.productForm.startTime)
      var endDate = new Date(this.productForm.endTime)
      var currentDate = Date.now()
      var result = currentDate < endDate && startDate < endDate
      if (!result) {
        this.$message.error('End date should be later than the start date or the current date')
      }
      return result
    },
    submitForm() {
      this.$refs['productForm'].validate((valid) => {
        if (valid && this.validateDates()) {
          this.loading = true
          this.setupCreateFormData()
          if (!this.isEditting) { // ??
            console.log(this.productForm)
            productApi.createProduct(this.productForm).then(response => {
              this.$message.success('Post Succeeded!')
              this.pid = response.data.pid
              console.log('return pid:' + this.pid)
              // handle pictures
              this.$router.push({ path: `/product/${this.pid}` })
              this.loading = false
            }).catch(() => {
              this.loading = false
            })
          } else { // ??
            productApi.updateProduct(this.productForm).then(() => {
              this.$message.success('Post Succeeded!')
              this.$router.push({ path: `/product/${this.pid}` })
              this.loading = false
            }).catch(() => {
              this.$message.error('Network Error')
              this.loading = false
            })
          }
        }
      })
    },
    cancelForm() {
      var r = confirm('Are you sure you want to cancel? The changes will not be saved.')
      if (r === true) {
        // jump to dashboard
        if (this.isEditting) {
          this.$router.push(`/product/${this.pid}`)
        } else {
          this.$router.push('/dashboard')
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .emptyGif {
    width: 100%;
  }
  .headerspan{
    padding-left: 30px;
  }
  .defectForm{
    width: 100%;
    position: relative;
    padding: 20px;
    .selector{
      width: 400px;
    }
  }

  .image-container
  {
    width: 300px !important;
    height: 300px !important;
  }

  .dashboard-editor-container {
  padding: 32px;
  padding-right: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

    .chart-wrapper {
      padding: 0px 10px 0;
      margin-bottom: 32px;
    }
  }

.title-input
{
  width: 500px;
}

.description-input ::v-deep {
  textarea {
    width: 500px;
    height: 300px;
    padding-right: 40px;
    resize: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }
}

.align-right
{
  float: right;
}
</style>


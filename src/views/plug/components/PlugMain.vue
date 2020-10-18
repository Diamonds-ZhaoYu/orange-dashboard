<template>
  <div class="plug-container">
    <el-row>
        <el-col :span="12"  :offset="14">
            <el-button icon="el-icon-tickets" @click="handleVisible">{{buttonViewTitle}}</el-button>
            <el-button v-show="enable" type="primary" style="background-color: red" @click="dialogPlugVisible = true" icon="el-icon-d-arrow-right">{{plugBthTitle}}</el-button>
            <el-button v-show="enable === false" type="primary" @click="dialogPlugVisible = true" icon="el-icon-caret-right">{{plugBthTitle}}</el-button>
            <el-button icon="el-icon-menu" @click="showDialogAddPlugVisible">添加选择器</el-button>
            <el-button icon="el-icon-refresh" @click="handleSyncShow">同步配置</el-button>
        </el-col>
    </el-row>
    <el-row v-show="initVisible === false">
        <el-col :span="6" :offset="0">
            <el-card>
               <div>
                   <h1 class="m-xs">选择器列表</h1>
                   <span class="no-margins"><v-icon name="hand-pointer" /> 拖动改变执行顺序</span>
                   <el-button style="float: right;padding: 5px 5px;" icon="el-icon-menu" @click="oderSelectors">保存排序</el-button>
               </div>
               <ul style="padding-inline-start: 0px" @dragstart="onDragStart" @dragover="onDragOver" @dragend="onDragEnd" ref="parentNode">
                    <li draggable="true" class="plug-selectors-item" v-for="child in selectors" :id="child.id" :key="child.id" @click="selectPlug(child)" >
                        <h6 class="plug-selectors-item-title">{{child.name}}</h6>
                        <div>
                            <b class="plug-selectors-item-time"><v-icon style="width: 13px;height: 13px;" name="regular/clock" /> {{child.time}}</b>
                            <el-button class="plug-selectors-item-button" @click="delSelectors(child)">删除</el-button>
                            <el-button class="plug-selectors-item-button" @click="editSelectors(child)">编辑</el-button>
                        </div>
                    </li>
               </ul>
            </el-card>
        </el-col>
      <el-col :span="18" :offset="0">
          <el-card>
              <div>
                  <h1 class="m-xs">选择器{{selectName}}规则列表</h1>
                  <span class="no-margins"><v-icon name="hand-pointer" /> 在列表之间拖动以改变规则顺序</span>
                  <div style="float: right">
                      <el-button style="padding: 5px 5px;" icon="el-icon-menu" @click="orderRules">保存排序</el-button>
                      <el-button style="padding: 5px 5px;" icon="el-icon-menu" @click="showDialogAddPlugRulesVisible">添加规则</el-button>
                  </div>
              </div>
              <div v-show="rulesData.length === 0" class="alert alert-warning" style="margin: 25px 0 10px 0;">
                  <p class="p-class">该选择器下没有规则,请添加!</p>
              </div>
              <ul style="padding-inline-start:0px" @dragstart="onDragRulesStart" @dragover="onDragRulesOver" @dragend="onDragRulesEnd" ref="parentRulesNode">
                  <li draggable="true" class="plug-selectors-item" :class="{'info-element':item.enable}" :id="item.id" v-for="item in rulesData" :key="item.id">
                      <table class="table table-hover single-rule-table">
                          <tbody>
                            <tr>
                                <td class="center rule-enable-td">
                                    <span v-show="item.enable" class="label label-primary">已启用</span>
                                    <span v-show="item.enable === false" class="label label-warning">已禁用</span>
                                </td>
                                <td class="rule-name-td">
                                    <b class="namep">{{item.name}}</b>
                                </td>
                                <td class="left rule-condition-td">
                                    <p v-show="item.judge.type == 0">
                                        <b>类型</b>: 单一条件匹配
                                    </p>
                                    <p v-show="item.judge.type == 1">
                                        <b>类型</b>: and匹配
                                    </p>

                                    <p v-show="item.judge.type == 2">
                                        <b>类型</b>: or匹配
                                    </p>

                                    <p v-show="item.judge.type == 3">
                                        <b>类型</b>: 复杂规则 <br/>
                                        <b>表达式</b>: {{item.judge.expression}}
                                    </p>

                                    <p class="conditionp" v-for="cd in item.judge.conditions"  :key="cd.key">{{cd.type}}:{{cd.operator}} {{cd.value}}</p>
                                </td>
                                <td class="left rule-extractor-td">
                                    <p class="extractorp">
                                        <span  v-show="item.extractor.type === 1"> <b>变量提取类型</b>:  索引式提取  </span>
                                        <span  v-show="item.extractor.type === 2"> <b>变量提取类型</b>:  模板式提取  </span><br>
                                        <span v-for="ec in item.extractor.extractions" :key="ec.key">
                                          {  {{ec.type}}:{{ec.name}}  }<br>
                                        </span>
                                    </p>
                                </td>
                                <td class="left rule-urltmpl-td">
                                    <b>URI模板</b>:                             <br>
                                    <p class="urltmplp"></p>
                                    <b>记录日志</b>: {{item.handle.log}}
                                </td>
                                <td class="left" title="变更时间">
                                    <small>{{item.time}}</small>
                                </td>
                                <td class="center rule-op-td">
                                    <el-button class="plug-selectors-item-button" @click="editRules(item)">编辑</el-button>
                                    <el-button class="plug-selectors-item-button" @click="delRules(item)">删除</el-button>
                                </td>
                            </tr>
                          </tbody>
                      </table>
                  </li>
              </ul>
          </el-card>
      </el-col>
    </el-row>
    <el-row v-show="initVisible === true">
      <el-col :span="8" :offset="16">

      </el-col>
      <el-col :span="24"  :offset="0">
          <el-card>
              <json-viewer class="json-viewer" :value="initData" :expand-depth=4 sort></json-viewer>
          </el-card>
      </el-col>
    </el-row>
    <el-dialog
              title="插件设置"
              :visible.sync="dialogPlugVisible"
              width="30%"
              :before-close="handleClose">
        <span>确定要开启{{titileName}}吗？</span>
        <span slot="footer" class="dialog-footer">
         <el-button @click="dialogPlugVisible = false">取 消</el-button>
         <el-button type="primary" @click="handleEnable">确定</el-button>
        </span>
    </el-dialog>
    <!-- add selector start -->
    <el-dialog
              title="添加选择器"
              :visible.sync="dialogAddPlugVisible"
              width="50%"
              :before-close="handleClose">
        <el-form :model="form" :rules="rules" ref="form" class="demo-form" label-width="80px">
            <el-form-item label="名称" prop="name">
                <el-input v-model="form.name" placeholder="名称"></el-input>
            </el-form-item>
            <el-form-item label="类型" prop="type">
                <el-select v-model="form.type" placeholder="请选择类型">
                    <el-option
                            v-for="item in selectorType"
                            :key="item.key"
                            :label="item.value"
                            :value="item.key">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="规则" v-show="form.type === 1">
                <el-select v-model="form.judge.type" placeholder="请选择规则">
                    <el-option
                            v-for="item in ruleJudgeTypes"
                            :key="item.key"
                            :label="item.value"
                            :value="item.key">
                    </el-option>
                </el-select>
                <el-input v-show="form.judge.type === 3" v-model="form.expression" style="width: 280px" placeholder="规则表达式，示例：(v[1] or v[2]) and v[3]"></el-input>
                <ul style="padding-inline-start:0px" class="conditions-row">
                    <li v-for="(conditions, index) in form.judge.conditions" :key="index">
                        <el-select v-model="conditions.type" placeholder="请选择规则">
                            <el-option
                                    v-for="item in conditionTypes"
                                    :key="item.key"
                                    :label="item.value"
                                    :value="item.key">
                            </el-option>
                        </el-select>
                        <el-select v-model="conditions.operator" placeholder="请选择规则">
                            <el-option
                                    v-for="item in conditionOperators"
                                    :key="item.key"
                                    :label="item.value"
                                    :value="item.key">
                            </el-option>
                        </el-select>
                        <el-input v-model="conditions.value" placeholder="value" style="width: 30%"></el-input>
                        <i
                         v-show="form.judge.type !== 0"
                         class="el-icon-plus"
                         @click="form.judge.conditions.push({
                            type: 'URI',
                            operator: 'match',
                            value: ''
                         })"></i>
                        <i v-show="form.judge.type !== 0" class="el-icon-close"  @click="form.judge.conditions.length > 1 && form.judge.conditions.splice(index, 1)"></i>
                    </li>
                </ul>
            </el-form-item>
            <el-form-item label="处理">
                <el-select v-model="form.handle.continue" placeholder="请选择处理方式">
                    <el-option
                            v-for="item in selectorContinues"
                            :key="item.key"
                            :label="item.value"
                            :value="item.key">
                    </el-option>
                </el-select>
                <el-select prop="handleLog" v-model="form.handle.log" placeholder="请选择日志处理">
                    <el-option
                            v-for="item in selectorLogs"
                            :key="item.key"
                            :label="item.value"
                            :value="item.key">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="" prop="enable">
                <el-checkbox v-model="form.enable" label="启用" name="enable"></el-checkbox>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
         <el-button @click="dialogAddPlugVisible = false">取 消</el-button>
         <el-button @click="showViewData(form)">预 览</el-button>
         <el-button type="primary" @click="submitForm">确定</el-button>
        </span>
    </el-dialog>
    <!-- add selector end -->
    <!-- add rules start -->
    <el-dialog
          title="添加规则"
          :visible.sync="dialogAddPlugRulesVisible"
          width="50%"
          :before-close="handleClose">
      <el-form :model="formRules" :rules="rulesRule" ref="formRules" class="demo-form" label-width="80px">
          <el-form-item label="名称" prop="name">
              <el-input v-model="formRules.name" placeholder="名称"></el-input>
          </el-form-item>
          <el-form-item label="规则">
              <el-select v-model="formRules.judge.type" placeholder="请选择规则">
                  <el-option
                          v-for="item in ruleJudgeTypes"
                          :key="item.key"
                          :label="item.value"
                          :value="item.key">
                  </el-option>
              </el-select>
              <el-input v-show="formRules.judge.type === 3" v-model="form.expression" style="width: 280px" placeholder="规则表达式，示例：(v[1] or v[2]) and v[3]">
              </el-input>
              <ul style="padding-inline-start:0px" class="conditions-row">
                  <li v-for="(conditions, index) in formRules.judge.conditions" :key="index">
                      <el-select v-model="conditions.type" placeholder="请选择规则">
                          <el-option
                                  v-for="item in conditionTypes"
                                  :key="item.key"
                                  :label="item.value"
                                  :value="item.key">
                          </el-option>
                      </el-select>
                      <el-select v-model="conditions.operator" placeholder="请选择规则">
                          <el-option
                                  v-for="item in conditionOperators"
                                  :key="item.key"
                                  :label="item.value"
                                  :value="item.key">
                          </el-option>
                      </el-select>
                      <el-input v-model="conditions.value" placeholder="value" style="width: 30%"></el-input>
                      <i
                              v-show="formRules.judge.type !== 0"
                              class="el-icon-plus"
                              @click="formRules.judge.conditions.push({
                        type: 'URI',
                        operator: 'match',
                        value: ''
                     })"></i>
                      <i v-show="formRules.judge.type !== 0" class="el-icon-close"  @click="formRules.judge.conditions.length > 1 && formRules.judge.conditions.splice(index, 1)"></i>
                  </li>
              </ul>
          </el-form-item>
          <el-form-item label="变量">
              <el-select v-model="formRules.extractor.type" placeholder="请选择变量">
                  <el-option
                          v-for="item in ruleExtractorType"
                          :key="item.key"
                          :label="item.value"
                          :value="item.key">
                  </el-option>
              </el-select>
              <i
                      class="el-icon-plus"
                      @click="formRules.extractor.extractions.push({
                        type: 'URI',
                        operator: 'match',
                        value: ''
                     })"></i>
              <ul style="padding-inline-start:0px" class="conditions-row">
                  <li v-for="(conditions, index) in formRules.extractor.extractions" :key="index">
                      <el-select v-model="conditions.type" placeholder="请选择规则">
                          <el-option
                                  v-for="item in conditionTypes"
                                  :key="item.key"
                                  :label="item.value"
                                  :value="item.key">
                          </el-option>
                      </el-select>
                      <el-select v-model="conditions.operator" placeholder="请选择规则">
                          <el-option
                                  v-for="item in conditionOperators"
                                  :key="item.key"
                                  :label="item.value"
                                  :value="item.key">
                          </el-option>
                      </el-select>
                      <el-input v-model="conditions.value" placeholder="value" style="width: 30%"></el-input>
                      <i
                              class="el-icon-plus"
                              @click="formRules.extractor.extractions.push({
                        type: 'URI',
                        operator: 'match',
                        value: ''
                     })"></i>
                      <i class="el-icon-close"  @click="formRules.extractor.extractions.splice(index, 1)"></i>
                  </li>
              </ul>
          </el-form-item>
          <el-form-item label="Header">
              <i
                      class="el-icon-plus"
                      @click="formRules.headers.push({
                        type: 'URI',
                        operator: 'match',
                        value: ''
                     })"></i>
              <ul style="padding-inline-start:0px" class="conditions-row">
                  <li v-for="(conditions, index) in formRules.headers" :key="index">
                      <el-select v-model="conditions.type" placeholder="请选择规则">
                          <el-option
                                  v-for="item in conditionTypes"
                                  :key="item.key"
                                  :label="item.value"
                                  :value="item.key">
                          </el-option>
                      </el-select>
                      <el-select v-model="conditions.operator" placeholder="请选择规则">
                          <el-option
                                  v-for="item in conditionOperators"
                                  :key="item.key"
                                  :label="item.value"
                                  :value="item.key">
                          </el-option>
                      </el-select>
                      <el-input v-model="conditions.value" placeholder="value" style="width: 30%"></el-input>
                      <i
                              class="el-icon-plus"
                              @click="formRules.headers.push({
                        type: 'URI',
                        operator: 'match',
                        value: ''
                     })"></i>
                      <i class="el-icon-close"  @click="formRules.headers.splice(index, 1)"></i>
                  </li>
              </ul>
          </el-form-item>
          <el-form-item label="处理">
              <el-select prop="handleLog" v-model="formRules.handle.log" placeholder="请选择日志处理">
                  <el-option
                          v-for="item in selectorLogs"
                          :key="item.key"
                          :label="item.value"
                          :value="item.key">
                  </el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="" prop="enable">
              <el-checkbox v-model="formRules.enable" label="启用" name="enable"></el-checkbox>
          </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
         <el-button @click="dialogAddPlugRulesVisible = false">取 消</el-button>
         <el-button @click="showViewData(formRules)">预 览</el-button>
         <el-button type="primary" @click="submitRuleForm">确定</el-button>
      </span>
    </el-dialog>
    <!-- add rules end -->
    <el-dialog
          title="确定要从存储中同步配置吗?"
          :visible.sync="dialogVisible"
          width="30%"
          :before-close="handleClose">
      <json-viewer class="json-viewer" :value="syncData" :expand-depth=4 sort></json-viewer>
      <span slot="footer" class="dialog-footer">
     <el-button @click="dialogVisible = false">取 消</el-button>
     <el-button type="primary" @click="handleSyncData">确定同步</el-button>
    </span>
    </el-dialog>
    <el-dialog
          title="规则预览"
          :visible.sync="dialogViewVisible"
          width="30%"
          :before-close="handleClose">
      <json-viewer class="json-viewer" :value="viewData" :expand-depth=4 sort></json-viewer>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogViewVisible = false">返 回</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'
import JsonViewer from 'vue-json-viewer'
Vue.use(JsonViewer)
export default {
  name: 'PlugMain',
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  props: ['titileName'],
  data() {
    return {
      plugBthTitle: '',
      draging: null,
      target: null,
      orderSelectors: [],
      selectors: [],
      orderRulesData: [],
      rulesData: [],
      selectName: '-',
      selectorId: '',
      editMode: 1,
      editRulesMode: 1,
      enable: false,
      form: {
        id: '',
        name: '',
        type: 0,
        judge: {
          type: 0,
          conditions: [{
            type: 'URI',
            operator: 'match',
            value: ''
          }]
        },
        expression: '',
        handle: {
          continue: false,
          log: false
        },
        enable: false
      },
      formRules: {
        id: '',
        name: '',
        judge: {
          type: 0,
          conditions: [
            {
              type: 'Random',
              operator: 'match',
              value: ''
            }
          ]
        },
        extractor: {
          type: 1,
          extractions: []
        },
        handle: {
          log: true
        },
        headers: [],
        enable: false
      },
      rulesRule: {},
      rules: {
        name: [{ required: true, message: '请输入选择器名称', trigger: 'blur' }],
        type: [
          { required: true, message: '请选择类型', trigger: 'change' }
        ],
        handleLog: [
          { required: true, message: '请选择是否记录日志', trigger: 'change' }
        ],
        handleContinue: [
          { required: true, message: '请选择是否继续后续选择器', trigger: 'change' }
        ],
        enable: [
          { required: true, message: '请选择选择器开关', trigger: 'change' }
        ]
      },
      initVisible: false,
      dialogVisible: false,
      dialogPlugVisible: false,
      dialogAddPlugVisible: false,
      dialogAddPlugRulesVisible: false,
      dialogViewVisible: false,
      syncData: '',
      viewData: '',
      initData: '',
      buttonViewTitle: '数据视图',
      conditionTypes: [
        {
          'key': 'Random',
          'value': 'Random'
        },
        {
          'key': 'URI',
          'value': 'URI'
        },
        {
          'key': 'Header',
          'value': 'Header'
        },
        {
          'key': 'Query',
          'value': 'Query'
        },
        {
          'key': 'Cookie',
          'value': 'Cookie'
        },
        {
          'key': 'PostParams',
          'value': 'PostParams'
        },
        {
          'key': 'IP',
          'value': 'IP'
        },
        {
          'key': 'UserAgent',
          'value': 'UserAgent'
        },
        {
          'key': 'Host',
          'value': 'Host'
        },
        {
          'key': 'Referer',
          'value': 'Referer'
        },
        {
          'key': 'Method',
          'value': 'HttpMethod'
        }
      ],
      conditionOperators: [
        {
          'key': 'match',
          'value': 'Match'
        },
        {
          'key': 'not_match',
          'value': 'Not Match'
        },
        {
          'key': '=',
          'value': '>='
        },
        {
          'key': '!=',
          'value': '!='
        },
        {
          'key': '>',
          'value': '>'
        },
        {
          'key': '>=',
          'value': '≥'
        },
        {
          'key': '<',
          'value': '<'
        },
        {
          'key': '<=',
          'value': '>≤'
        },
        {
          'key': '%',
          'value': '%'
        }
      ],
      selectorType: [
        {
          'key': 0,
          'value': '全流量'
        },
        {
          'key': 1,
          'value': '自定义流量'
        }
      ],
      ruleExtractorType: [
        {
          'key': 1,
          'value': '索引式提取'
        },
        {
          'key': 2,
          'value': '模板式提取'
        }
      ],
      ruleJudgeTypes: [
        {
          'key': 0,
          'value': '单一条件匹配'
        },
        {
          'key': 1,
          'value': 'and匹配'
        },
        {
          'key': 2,
          'value': 'or匹配'
        },
        {
          'key': 3,
          'value': '复杂匹配'
        }
      ],
      selectorContinues: [
        {
          'key': true,
          'value': '继续后续选择器'
        },
        {
          'key': false,
          'value': '略过后续选择器'
        }
      ],
      selectorLogs: [
        {
          'key': false,
          'value': '不记录日志'
        },
        {
          'key': true,
          'value': '记录日志'
        }
      ]
    }
  },
  created() {
    this.handleInitData()
  },
  mounted() {
    document.body.ondrop = function(event) {
      event.preventDefault()
      event.stopPropagation()
    }
  },
  methods: {
    submitForm() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          const { id, name, type, judge, expression, handle, enable } = this.form
          let contentObj = {
            'name': name,
            'type': type,
            'judge': judge,
            'handle': handle,
            'enable': enable
          }
          if (this.editMode !== 1) {
            contentObj = {
              'id': id,
              'name': name,
              'type': type,
              'judge': judge,
              'handle': handle,
              'enable': enable
            }
          }
          if (type === 1) {
            if (!Array.isArray(judge.conditions)) {
              this.$message.error('conditions是数组')
              return
            }

            if (judge.type === 0 && judge.conditions.length > 1) {
              this.$message.error('单一条件匹配只能填写一条规则')
              return
            }
            if (judge.type !== 0 && judge.conditions.length === 1) {
              this.$message.error('AND/OR/复杂匹配，需填写多条规则')
              return
            }
            contentObj.judge = {
              type: judge.type,
              conditions: judge.conditions
            }

            if (judge.type === 3) {
              contentObj.judge.expression = expression
            }
          } else if (type === 0) {
            contentObj.judge = {}
          }
          if (this.editMode === 1) {
            this.$emit('addSelectors', this, JSON.stringify(contentObj))
          } else {
            this.$emit('updateSelectors', this, JSON.stringify(contentObj))
          }
        }
      })
    },
    showDialogAddPlugVisible() {
      this.dialogAddPlugVisible = true
      this.editMode = 1
      this.resetForm()
    },
    showDialogAddPlugRulesVisible() {
      if (this.selectorId === '' || this.selectorId === null) {
        this.$message.error('请选择选择器！')
        return
      }
      this.dialogAddPlugRulesVisible = true
      this.editRulesMode = 1
      this.resetRulesForm()
    },
    submitRuleForm() {
      this.$refs.formRules.validate(async valid => {
        if (valid) {
          const { id, name, judge, handle, extractor, headers, enable } = this.formRules
          let contentObj = {
            'name': name,
            'judge': judge,
            'handle': handle,
            'extractor': extractor,
            'headers': headers,
            'enable': enable
          }
          if (this.editRulesMode === 2) {
            contentObj = {
              'id': id,
              'name': name,
              'judge': judge,
              'handle': handle,
              'extractor': extractor,
              'headers': headers,
              'enable': enable
            }
          }

          if (this.editRulesMode === 1) {
            this.$emit('addRules', this, this.selectorId, JSON.stringify(contentObj))
          } else {
            this.$emit('updateRules', this, this.selectorId, JSON.stringify(contentObj))
          }
        }
      })
    },
    resetForm() {
      this.form = {
        name: '',
        type: 0,
        judge: {
          type: 0,
          conditions: [
            {
              type: 'URI',
              operator: 'match',
              value: ''
            }
          ]
        },
        expression: '',
        handle: {
          continue: false,
          log: false
        },
        enable: false
      }
    },
    resetRulesForm() {
      this.formRules = {
        id: '',
        name: '',
        judge: {
          type: 0,
          conditions: [
            {
              type: 'Random',
              operator: 'match',
              value: ''
            }
          ]
        },
        extractor: {
          type: 1,
          extractions: []
        },
        handle: {
          log: true
        },
        headers: [],
        enable: false
      }
    },
    handleVisible() {
      if (this.initVisible === true) {
        this.initVisible = false
        this.buttonViewTitle = '数据视图'
      } else {
        this.initVisible = true
        this.buttonViewTitle = '表格视图'
      }
    },
    getSelectors(response) {
      if (response.data.data.enable === true) {
        this.plugBthTitle = '停用该插件'
      } else {
        this.plugBthTitle = '启用该插件'
      }
      console.log(response.data.data.enable)
      this.enable = response.data.data.enable
      this.initData = response.data.data
      this.orderSelectors = response.data.data.meta
      if (this.orderSelectors.selectors) {
        var arraySelectors = {}
        for (var i = 0; i < this.orderSelectors.selectors.length; i++) {
          arraySelectors[this.orderSelectors.selectors[i]] = response.data.data.selectors[this.orderSelectors.selectors[i]]
        }
        this.selectors = arraySelectors
        this.selectPlug(response.data.data.selectors[this.orderSelectors.selectors[0]])
      }
    },
    getRules(response) {
      this.rulesData = response.data.data.rules
    },
    handleInitData() {
      this.$emit('getSelectors', this)
    },
    handleSyncData() {
      this.$emit('syncPlugData', this)
    },
    handleSyncShow() {
      this.$emit('fetchConfig', this)
    },
    handleEnable() {
      var eb = this.enable === true ? 0 : 1
      this.$emit('enablePlug', this, eb)
    },
    enablePlug(response) {
      if (response.data.success) {
        if (this.enable) {
          this.enable = false
          this.plugBthTitle = '启动该插件'
        } else {
          this.enable = true
          this.plugBthTitle = '停用该插件'
        }
      }
    },
    selectPlug(data) {
      this.selectName = '【' + data.name + '】'
      this.selectorId = data.id
      this.$emit('getRules', this, data.id)
    },
    addPlug(data) {
      this.selectName = '【' + data.name + '】'
      this.selectorId = data.id
      this.$emit('addRules', this, this.selectorId, data.id)
    },
    delSelectors(data) {
      this.$emit('delSelectors', this, data.id)
    },
    editSelectors(data) {
      this.$emit('editSelectors', this, data)
    },
    delRules(data) {
      this.$emit('delRules', this, this.selectorId, data.id)
    },
    editRules(data) {
      this.$emit('editRules', this, this.selectorId, data)
    },
    oderSelectors() {
      const currentNodes = Array.from(this.$refs.parentNode.childNodes)
      const data = currentNodes.map((i, index) => {
        const item = i.id
        return item
      })
      if (data.length > 0) {
        this.$emit('oderSelectors', this, data.join(','))
      } else {
        this.$message.error('没有数据！')
      }
    },
    orderRules() {
      const self = this.rulesData
      console.log(self)
      const currentNodes = Array.from(this.$refs.parentRulesNode.childNodes)
      const data = currentNodes.map((i, index) => {
        const item = i.id
        return item
      })
      if (data.length > 0) {
        this.$emit('orderRules', this, this.selectorId, data.join(','))
      } else {
        this.$message.error('名称不能为空！')
      }
    },
    handleClose(done) {
      done()
    },
    showViewData(data) {
      if (data.name === '' || data.name == null) {
        this.$message.error('名称不能为空！')
        return
      }
      this.dialogViewVisible = true
      this.viewData = data
    },
    onDragStart(event) {
      console.log('drag start')
      this.draging = event.target
    },
    onDragOver(event) {
      console.log('drag move')
      this.target = event.target
      if (this.target.nodeName === 'LI' && this.target !== this.draging) {
        if (this._index(this.draging) < this._index(this.target)) {
          this.target.parentNode.insertBefore(this.draging, this.target.nextSibling)
        } else {
          this.target.parentNode.insertBefore(this.draging, this.target)
        }
      }
    },
    onDragEnd(event) {
      console.log('drag end')
      const currentNodes = Array.from(this.$refs.parentNode.childNodes)
      const self = this.selectors
      console.log(self)
      const data = currentNodes.map((i, index) => {
        const item = self[i.id]
        console.log(item)
        return item
      })
      console.log(data)
    },
    _index(el) {
      const domData = Array.from(this.$refs.parentNode.childNodes)
      return domData.findIndex(i => i.innerText === el.innerText)
    },
    onDragRulesStart(event) {
      console.log('drag start')
      this.draging = event.target
    },
    onDragRulesOver(event) {
      console.log('drag move')
      this.target = event.target
      if (this.target.nodeName === 'LI' && this.target !== this.draging) {
        if (this._indexRules(this.draging) < this._indexRules(this.target)) {
          this.target.parentNode.insertBefore(this.draging, this.target.nextSibling)
        } else {
          this.target.parentNode.insertBefore(this.draging, this.target)
        }
      }
    },
    onDragRulesEnd(event) {
      console.log('drag end')
      const currentNodes = Array.from(this.$refs.parentRulesNode.childNodes)
      const self = this.rulesData
      console.log(self)
      const data = currentNodes.map((i, index) => {
        const item = self[index]
        console.log(item)
        return item
      })
      console.log(data)
    },
    _indexRules(el) {
      const domData = Array.from(this.$refs.parentRulesNode.childNodes)
      return domData.findIndex(i => i.innerText === el.innerText)
    }
  }
}
</script>

<style lang="scss" scoped>
.plug {
  &-container {
    margin: 10px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }

}
.plug-container {
    .el-card {
        margin-top: 10px;
        margin-left: 5px;
    }
    .plug-selectors-item{
        cursor: hand;
        padding: 6px;
        border: 1px solid #e7eaec;
        border-left: 3px solid #f8ac59;
        margin: 0px 0 10px 0;
        border-radius: 2px;
        list-style: none;
        font-size: 13px;
        color: #676a6c;
        cursor: pointer;
    }
    .selected-selector{
        background-color: #fcf8e3;
    }
    .plug-selectors-item-button {
        width: 40px;
        padding: 5px 5px;
    }
    .plug-selectors-item-title {
        margin-top: 0px;
        margin-bottom: 10px;
    }

    .plug-selectors-item-time {
        margin-right: 20px;
    }
    .alert {
        padding: 15px;
        margin-bottom: 20px;
        border: 1px solid transparent;
        border-radius: 4px;
    }
    .alert-warning {
        color: #8a6d3b;
        background-color: #fcf8e3;
        border-color: #faebcc;
    }
    .warning-element {
        border-left: 3px solid #f8ac59;
        border: 1px solid #e7eaec;
        margin: 0px 0 10px 0;
        border-radius: 2px;
        padding: 2px;
    }
    .table {
        width: 100%;
        max-width: 100%;
        margin-bottom: 20px;
    }
    .table:hover{
        background-color: #F5F5F5;
    }
    .single-rule-table {
        margin-bottom: 0;
    }
    .label-primary {
        background-color: #337ab7 !important;
        color: white !important;
    }
    .label-warning {
        background-color: #f0ad4e !important;
        color: white !important;
    }

    .info-element {
        border-left: 3px solid #1c84c6 !important;
    }

    .label {
        background-color: #d1dade;
        color: #5e5e5e;
        font-size: 10px;
        font-weight: 600;
        padding: 3px 8px;
        text-shadow: none;
    }
    .rule-op-td {
        width: 130px;
    }
}

a {
    color: #337ab7;
}
.hljs {
    display: block;
    overflow-x: auto;
    padding: 0.5em;
    color: #333;
    background: #f8f8f8;
    -webkit-text-size-adjust: none;
}
.code {
    background-color: #F9F2F4;
    border-radius: 4px;
    color: #ca4440;
    font-size: 90%;
    padding: 2px 4px;
    white-space: nowrap;
}
.json-viewer {
    background-color: #f5f5f5;
    border: 1px solid #ccc;
}
.conditions-row {
    li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 10px;

        .el-select {
            width: 120px;
        }

        .el-input {
            width: 100px;
        }

        i {
            font-size: 16px;
            cursor: pointer;
        }
    }
}
</style>

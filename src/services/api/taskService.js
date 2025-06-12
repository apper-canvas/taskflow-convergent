import { toast } from 'react-toastify'

class TaskService {
  constructor() {
    this.tableName = 'task'
    this.apperClient = null
    this.initializeClient()
  }

  initializeClient() {
    if (typeof window !== 'undefined' && window.ApperSDK) {
      const { ApperClient } = window.ApperSDK
      this.apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
    }
  }

  async getAll() {
    try {
      if (!this.apperClient) this.initializeClient()
      
      const params = {
        fields: ['Id', 'Name', 'title', 'description', 'category_id', 'priority', 'status', 'due_date', 'created_at', 'completed_at', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy'],
        orderBy: [
          {
            fieldName: 'created_at',
            SortType: 'DESC'
          }
        ]
      }
      
      const response = await this.apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }
      
      return response.data || []
    } catch (error) {
      console.error('Error fetching tasks:', error)
      toast.error('Failed to load tasks')
      return []
    }
  }

  async getById(id) {
    try {
      if (!this.apperClient) this.initializeClient()
      
      const params = {
        fields: ['Id', 'Name', 'title', 'description', 'category_id', 'priority', 'status', 'due_date', 'created_at', 'completed_at', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy']
      }
      
      const response = await this.apperClient.getRecordById(this.tableName, id, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        throw new Error(response.message)
      }
      
      return response.data
    } catch (error) {
      console.error(`Error fetching task with ID ${id}:`, error)
      throw error
    }
  }

  async create(taskData) {
    try {
      if (!this.apperClient) this.initializeClient()
      
      // Only include Updateable fields for create operation
      const updateableData = {
        Name: taskData.title || taskData.Name,
        title: taskData.title,
        description: taskData.description,
        category_id: parseInt(taskData.categoryId || taskData.category_id) || null,
        priority: taskData.priority,
        status: taskData.status || 'pending',
        due_date: taskData.dueDate || taskData.due_date,
        created_at: taskData.createdAt || taskData.created_at || new Date().toISOString(),
        completed_at: taskData.completedAt || taskData.completed_at || null,
        Tags: taskData.Tags || '',
        Owner: taskData.Owner || null
      }
      
      const params = {
        records: [updateableData]
      }
      
      const response = await this.apperClient.createRecord(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success)
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${failedRecords}`)
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`)
            })
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successfulRecords.length > 0) {
          return successfulRecords[0].data
        }
      }
      
      throw new Error('Failed to create task')
    } catch (error) {
      console.error('Error creating task:', error)
      throw error
    }
  }

  async update(id, updateData) {
    try {
      if (!this.apperClient) this.initializeClient()
      
      // Only include Updateable fields for update operation
      const updateableData = {
        Id: parseInt(id),
        ...(updateData.title !== undefined && { Name: updateData.title, title: updateData.title }),
        ...(updateData.description !== undefined && { description: updateData.description }),
        ...(updateData.categoryId !== undefined && { category_id: parseInt(updateData.categoryId) || null }),
        ...(updateData.priority !== undefined && { priority: updateData.priority }),
        ...(updateData.status !== undefined && { status: updateData.status }),
        ...(updateData.dueDate !== undefined && { due_date: updateData.dueDate }),
        ...(updateData.completedAt !== undefined && { completed_at: updateData.completedAt }),
        ...(updateData.Tags !== undefined && { Tags: updateData.Tags }),
        ...(updateData.Owner !== undefined && { Owner: updateData.Owner })
      }
      
      const params = {
        records: [updateableData]
      }
      
      const response = await this.apperClient.updateRecord(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success)
        const failedUpdates = response.results.filter(result => !result.success)
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${failedUpdates}`)
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`)
            })
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successfulUpdates.length > 0) {
          return successfulUpdates[0].data
        }
      }
      
      throw new Error('Failed to update task')
    } catch (error) {
      console.error('Error updating task:', error)
      throw error
    }
  }

  async delete(id) {
    try {
      if (!this.apperClient) this.initializeClient()
      
      const params = {
        RecordIds: [parseInt(id)]
      }
      
      const response = await this.apperClient.deleteRecord(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return false
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success)
        const failedDeletions = response.results.filter(result => !result.success)
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${failedDeletions}`)
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }
        
        return successfulDeletions.length > 0
      }
      
      return false
    } catch (error) {
      console.error('Error deleting task:', error)
      throw error
    }
  }

  async getByCategory(categoryId) {
    try {
      if (!this.apperClient) this.initializeClient()
      
      const params = {
        fields: ['Id', 'Name', 'title', 'description', 'category_id', 'priority', 'status', 'due_date', 'created_at', 'completed_at', 'Tags', 'Owner'],
        where: [
          {
            fieldName: 'category_id',
            operator: 'ExactMatch',
            values: [categoryId.toString()]
          }
        ]
      }
      
      const response = await this.apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        return []
      }
      
      return response.data || []
    } catch (error) {
      console.error('Error fetching tasks by category:', error)
      return []
    }
  }

  async getByStatus(status) {
    try {
      if (!this.apperClient) this.initializeClient()
      
      const params = {
        fields: ['Id', 'Name', 'title', 'description', 'category_id', 'priority', 'status', 'due_date', 'created_at', 'completed_at', 'Tags', 'Owner'],
        where: [
          {
            fieldName: 'status',
            operator: 'ExactMatch',
            values: [status]
          }
        ]
      }
      
      const response = await this.apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        return []
      }
      
      return response.data || []
    } catch (error) {
      console.error('Error fetching tasks by status:', error)
      return []
    }
  }

  async getByPriority(priority) {
    try {
      if (!this.apperClient) this.initializeClient()
      
      const params = {
        fields: ['Id', 'Name', 'title', 'description', 'category_id', 'priority', 'status', 'due_date', 'created_at', 'completed_at', 'Tags', 'Owner'],
        where: [
          {
            fieldName: 'priority',
            operator: 'ExactMatch',
            values: [priority]
          }
        ]
      }
      
      const response = await this.apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        return []
      }
      
      return response.data || []
    } catch (error) {
      console.error('Error fetching tasks by priority:', error)
      return []
    }
  }

  async search(query) {
    try {
      if (!this.apperClient) this.initializeClient()
      
      const params = {
        fields: ['Id', 'Name', 'title', 'description', 'category_id', 'priority', 'status', 'due_date', 'created_at', 'completed_at', 'Tags', 'Owner'],
        whereGroups: [
          {
            operator: 'OR',
            subGroups: [
              {
                conditions: [
                  {
                    fieldName: 'title',
                    operator: 'Contains',
                    values: [query]
                  }
                ]
              },
              {
                conditions: [
                  {
                    fieldName: 'description',
                    operator: 'Contains',
                    values: [query]
                  }
                ]
              }
            ]
          }
        ]
      }
      
      const response = await this.apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        return []
      }
      
      return response.data || []
    } catch (error) {
      console.error('Error searching tasks:', error)
      return []
    }
  }
}

export default new TaskService()
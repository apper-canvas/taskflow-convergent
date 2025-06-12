import { toast } from 'react-toastify'

class CategoryService {
  constructor() {
    this.tableName = 'category'
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
        fields: ['Id', 'Name', 'color', 'icon', 'task_count', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy'],
        orderBy: [
          {
            fieldName: 'Name',
            SortType: 'ASC'
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
      console.error('Error fetching categories:', error)
      toast.error('Failed to load categories')
      return []
    }
  }

  async getById(id) {
    try {
      if (!this.apperClient) this.initializeClient()
      
      const params = {
        fields: ['Id', 'Name', 'color', 'icon', 'task_count', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy']
      }
      
      const response = await this.apperClient.getRecordById(this.tableName, id, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        throw new Error(response.message)
      }
      
      return response.data
    } catch (error) {
      console.error(`Error fetching category with ID ${id}:`, error)
      throw error
    }
  }

  async create(categoryData) {
    try {
      if (!this.apperClient) this.initializeClient()
      
      // Only include Updateable fields for create operation
      const updateableData = {
        Name: categoryData.name || categoryData.Name,
        color: categoryData.color,
        icon: categoryData.icon,
        task_count: categoryData.taskCount || categoryData.task_count || 0,
        Tags: categoryData.Tags || '',
        Owner: categoryData.Owner || null
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
      
      throw new Error('Failed to create category')
    } catch (error) {
      console.error('Error creating category:', error)
      throw error
    }
  }

  async update(id, updateData) {
    try {
      if (!this.apperClient) this.initializeClient()
      
      // Only include Updateable fields for update operation
      const updateableData = {
        Id: parseInt(id),
        ...(updateData.name !== undefined && { Name: updateData.name }),
        ...(updateData.color !== undefined && { color: updateData.color }),
        ...(updateData.icon !== undefined && { icon: updateData.icon }),
        ...(updateData.taskCount !== undefined && { task_count: updateData.taskCount }),
        ...(updateData.task_count !== undefined && { task_count: updateData.task_count }),
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
      
      throw new Error('Failed to update category')
    } catch (error) {
      console.error('Error updating category:', error)
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
      console.error('Error deleting category:', error)
      throw error
    }
  }

  async updateTaskCount(categoryId, count) {
    try {
      return await this.update(categoryId, { task_count: count })
    } catch (error) {
      console.error('Error updating task count:', error)
      throw error
    }
  }
}

export default new CategoryService()
export default new CategoryService()
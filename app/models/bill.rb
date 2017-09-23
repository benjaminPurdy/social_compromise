class Bill < ActiveRecord::Base

  def summary_short_short
    summary_short = self.summary_short

    if summary_short.empty?
      summary_short = self.summary
    end

    if summary_short.empty?
      return 'No Summary Provided'
    end

    summary_short[0..200].gsub(/\s\w+\s*$/,'...')
  end
end
